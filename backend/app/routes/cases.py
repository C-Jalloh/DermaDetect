from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import joinedload

from ..extensions import db
from ..models import Case, Diagnosis, CHWUser, DoctorUser, Patient, MedGemmaQueue
from ..schemas import CaseSchema, DiagnosisSchema
from ..ai.tasks import run_medgemma_analysis

cases_bp = Blueprint("cases", __name__)
case_schema = CaseSchema()
cases_schema = CaseSchema(many=True)
diagnosis_schema = DiagnosisSchema()


@cases_bp.route("/cases", methods=["POST"])
@jwt_required()
def create_case():
    chw_id = get_jwt_identity()
    chw = db.session.get(CHWUser, chw_id)
    if not chw:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json(force=True)
    patient_id = data.get("patient_id")
    risk_level = data.get("risk_level", "low")

    # Verify patient belongs to this CHW
    patient = db.session.get(Patient, patient_id)
    if not patient or patient.chw_id != chw_id:
        return jsonify({"error": "Patient not found"}), 404

    # Create the case
    case_data = {
        "patient_id": patient_id,
        "chw_id": chw_id,
        "triage_data": data.get("triage_data", "{}"),
        "risk_level": risk_level,
        "image_urls": data.get("image_urls", "[]"),
        "sync_status": "new"
    }

    # Set status based on risk level
    if risk_level == "high":
        case_data["status"] = "REQUIRES_MEDGEMMA"
    else:
        case_data["status"] = "TRIAGED"

    case = Case(**case_data)
    db.session.add(case)
    db.session.commit()

    # For high-risk cases, create MedGemma queue entry and trigger analysis
    if risk_level == "high":
        queue_entry = MedGemmaQueue(case_id=case.id)
        db.session.add(queue_entry)
        db.session.commit()

        # Trigger MedGemma analysis asynchronously
        run_medgemma_analysis.delay(case.id)

    return jsonify(case_schema.dump(case)), 201


@cases_bp.route("/cases/<case_id>", methods=["GET"])
@jwt_required()
def get_case(case_id):
    # Allow both CHW and Doctor access
    user_id = get_jwt_identity()
    
    # Try to find as CHW first
    chw = db.session.get(CHWUser, user_id)
    if chw:
        case = db.session.get(Case, case_id)
        if not case or case.chw_id != user_id:
            return jsonify({"error": "Case not found"}), 404
    else:
        # Try as doctor - doctors can access any case
        doctor = db.session.get(DoctorUser, user_id)
        if not doctor:
            return jsonify({"error": "Unauthorized"}), 403
        
        case = db.session.get(Case, case_id)
        if not case:
            return jsonify({"error": "Case not found"}), 404

    return jsonify(case_schema.dump(case)), 200


@cases_bp.route("/cases", methods=["GET"])
@jwt_required()
def get_cases():
    chw_id = get_jwt_identity()
    chw = db.session.get(CHWUser, chw_id)
    if not chw:
        return jsonify({"error": "Unauthorized"}), 403

    cases = chw.cases
    return jsonify(cases_schema.dump(cases)), 200


@cases_bp.route("/cases/pending", methods=["GET"])
@jwt_required()
def get_pending_cases():
    doctor_id = get_jwt_identity()
    doctor = db.session.get(DoctorUser, doctor_id)
    if not doctor:
        return jsonify({"error": "Unauthorized"}), 403

    # Cases with status TRIAGED, PENDING_DIAGNOSIS, or REQUIRES_MEDGEMMA, high risk
    # Load patient relationship for each case
    pending_cases = db.session.query(Case).options(joinedload(Case.patient)).filter(
        Case.status.in_(["TRIAGED", "PENDING_DIAGNOSIS", "REQUIRES_MEDGEMMA"]),
        Case.risk_level == "high"
    ).all()

    return jsonify(cases_schema.dump(pending_cases)), 200


@cases_bp.route("/cases/<case_id>/diagnosis", methods=["POST"])
@jwt_required()
def create_diagnosis(case_id):
    doctor_id = get_jwt_identity()
    doctor = db.session.get(DoctorUser, doctor_id)
    if not doctor:
        return jsonify({"error": "Unauthorized"}), 403

    case = db.session.get(Case, case_id)
    if not case:
        return jsonify({"error": "Case not found"}), 404

    data = request.get_json(force=True)
    data["case_id"] = case_id
    data["doctor_id"] = doctor_id
    data["sync_status"] = "new"

    diagnosis = Diagnosis(**data)
    db.session.add(diagnosis)
    case.status = "DIAGNOSED"
    db.session.commit()

    return jsonify(diagnosis_schema.dump(diagnosis)), 201