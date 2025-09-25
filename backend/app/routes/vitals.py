from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import CHWUser, Patient, Vitals
from ..schemas import VitalsSchema

vitals_bp = Blueprint("vitals", __name__)
vitals_schema = VitalsSchema()
vitals_list_schema = VitalsSchema(many=True)


@vitals_bp.route("/patients/<patient_id>/vitals", methods=["GET"])
@jwt_required()
def get_patient_vitals(patient_id):
    chw_id = get_jwt_identity()
    patient = db.session.get(Patient, patient_id)
    
    if not patient or patient.chw_id != chw_id:
        return jsonify({"error": "Patient not found"}), 404

    vitals = patient.vitals
    return jsonify(vitals_list_schema.dump(vitals)), 200


@vitals_bp.route("/patients/<patient_id>/vitals", methods=["POST"])
@jwt_required()
def create_vitals(patient_id):
    chw_id = get_jwt_identity()
    patient = db.session.get(Patient, patient_id)
    
    if not patient or patient.chw_id != chw_id:
        return jsonify({"error": "Patient not found"}), 404

    data = request.get_json(force=True)
    data["patient_id"] = patient_id
    data["chw_id"] = chw_id
    data["sync_status"] = "new"

    vitals = Vitals(**data)
    db.session.add(vitals)
    db.session.commit()

    return jsonify(vitals_schema.dump(vitals)), 201