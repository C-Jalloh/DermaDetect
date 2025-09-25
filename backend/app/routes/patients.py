from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import CHWUser, DoctorUser, Patient, Vitals, Case
from ..schemas import PatientSchema, VitalsSchema, CaseSchema

patients_bp = Blueprint("patients", __name__)
patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)
vitals_schema = VitalsSchema(many=True)
case_schema = CaseSchema(many=True)


@patients_bp.route("/patients", methods=["GET"])
@jwt_required()
def get_patients():
    chw_id = get_jwt_identity()
    chw = db.session.get(CHWUser, chw_id)
    if not chw:
        return jsonify({"error": "Unauthorized"}), 403

    patients = chw.patients
    return jsonify(patients_schema.dump(patients)), 200


@patients_bp.route("/patients", methods=["POST"])
@jwt_required()
def create_patient():
    chw_id = get_jwt_identity()
    chw = db.session.get(CHWUser, chw_id)
    if not chw:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json(force=True)
    data["chw_id"] = chw_id
    data["sync_status"] = "new"

    patient = Patient(**data)
    db.session.add(patient)
    db.session.commit()

    return jsonify(patient_schema.dump(patient)), 201


@patients_bp.route("/patients/<patient_id>", methods=["GET"])
@jwt_required()
def get_patient(patient_id):
    user_id = get_jwt_identity()
    
    # Try to find as CHW first
    chw = db.session.get(CHWUser, user_id)
    if chw:
        patient = db.session.get(Patient, patient_id)
        if not patient or patient.chw_id != user_id:
            return jsonify({"error": "Patient not found"}), 404
    else:
        # Try as doctor - doctors can access any patient
        doctor = db.session.get(DoctorUser, user_id)
        if not doctor:
            return jsonify({"error": "Unauthorized"}), 403
        
        patient = db.session.get(Patient, patient_id)
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

    # Get patient data with vitals and cases
    patient_data = patient_schema.dump(patient)
    patient_data["vitals"] = vitals_schema.dump(patient.vitals)
    patient_data["cases"] = case_schema.dump(patient.cases)
    
    return jsonify(patient_data), 200