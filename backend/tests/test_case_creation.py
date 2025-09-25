from __future__ import annotations

import json
import pytest
from flask_jwt_extended import create_access_token

from app import create_app, db
from app.config import Config
from app.models import CHWUser, Patient, Case, MedGemmaQueue


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TESTING = True
    CELERY = Config.CELERY | {"task_always_eager": True}


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        chw = CHWUser(
            email="chw@example.com",
            password_hash="hash",
            name="Community Worker",
        )
        db.session.add(chw)
        db.session.commit()

        patient = Patient(
            chw_id=chw.id,
            demographics=json.dumps({"name": "Test Patient", "age": 30})
        )
        db.session.add(patient)
        db.session.commit()

        app.config["TEST_CHW_ID"] = chw.id
        app.config["TEST_PATIENT_ID"] = patient.id
    yield app
    with app.app_context():
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def auth_header(app):
    with app.app_context():
        token = create_access_token(identity=app.config["TEST_CHW_ID"])
        return {"Authorization": f"Bearer {token}"}


def test_create_high_risk_case_creates_medgemma_queue(client, auth_header, app):
    """Test that creating a high-risk case creates a MedGemmaQueue entry."""
    with app.app_context():
        case_data = {
            "patient_id": app.config["TEST_PATIENT_ID"],
            "triage_data": json.dumps({"risk_level": "high", "symptoms": "test symptoms"}),
            "risk_level": "high",
            "image_urls": json.dumps(["image1.jpg", "image2.jpg"])
        }

        response = client.post("/api/cases", json=case_data, headers=auth_header)
        assert response.status_code == 201

        response_data = response.get_json()
        case_id = response_data["id"]
        assert response_data["status"] == "REQUIRES_MEDGEMMA"
        assert response_data["risk_level"] == "high"

        # Check that MedGemmaQueue entry was created
        queue_entry = MedGemmaQueue.query.filter_by(case_id=case_id).first()
        assert queue_entry is not None
        assert queue_entry.status == "queued"
        assert queue_entry.attempts == 0


def test_create_low_risk_case_no_medgemma_queue(client, auth_header, app):
    """Test that creating a low-risk case does not create a MedGemmaQueue entry."""
    with app.app_context():
        case_data = {
            "patient_id": app.config["TEST_PATIENT_ID"],
            "triage_data": json.dumps({"risk_level": "low", "symptoms": "mild symptoms"}),
            "risk_level": "low",
            "image_urls": json.dumps(["image1.jpg"])
        }

        response = client.post("/api/cases", json=case_data, headers=auth_header)
        assert response.status_code == 201

        response_data = response.get_json()
        case_id = response_data["id"]
        assert response_data["status"] == "TRIAGED"
        assert response_data["risk_level"] == "low"

        # Check that no MedGemmaQueue entry was created
        queue_entry = MedGemmaQueue.query.filter_by(case_id=case_id).first()
        assert queue_entry is None