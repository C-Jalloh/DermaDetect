from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash

from ..extensions import db
from ..models import CHWUser, DoctorUser, Diagnosis

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")  # 'chw' or 'doctor'

    if role == "chw":
        user = CHWUser.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({"access_token": access_token, "user": {"id": user.id, "name": user.name, "role": "chw"}}), 200
    elif role == "doctor":
        user = DoctorUser.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({"access_token": access_token, "user": {"id": user.id, "name": user.name, "role": "doctor"}}), 200

    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    
    # Try CHW first
    user = CHWUser.query.get(user_id)
    if user:
        # Calculate statistics
        patient_count = len(user.patients)
        case_count = len(user.cases)
        
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": "chw",
            "stats": {
                "patients": patient_count,
                "cases": case_count,
                "this_week": case_count  # For now, just use total cases as this week
            }
        }), 200
    
    # Try Doctor
    user = DoctorUser.query.get(user_id)
    if user:
        # Calculate statistics for doctor
        diagnosis_count = len(user.diagnoses)
        
        # Count pending cases (cases that need diagnosis)
        from ..models import Case
        pending_cases_count = db.session.query(Case).filter(
            Case.status.in_(["TRIAGED", "PENDING_DIAGNOSIS", "REQUIRES_MEDGEMMA"]),
            Case.risk_level == "high"
        ).count()
        
        # This week's diagnoses (simplified - last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        weekly_diagnoses = db.session.query(Diagnosis).filter(
            Diagnosis.doctor_id == user_id,
            Diagnosis.created_at >= week_ago
        ).count()
        
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": "doctor",
            "stats": {
                "diagnoses": diagnosis_count,
                "pending_cases": pending_cases_count,
                "this_week": weekly_diagnoses
            }
        }), 200
    
    return jsonify({"error": "User not found"}), 404