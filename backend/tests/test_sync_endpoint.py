from __future__ import annotations

import json
from datetime import datetime, timezone

import pytest
from flask_jwt_extended import create_access_token

from app import create_app, db
from app.config import Config
from app.models import CHWUser


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TESTING = True
    CELERY = Config.CELERY | {"task_always_eager": True}


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        user = CHWUser(
            email="chw@example.com",
            password_hash="hash",
            name="Community Worker",
        )
        db.session.add(user)
        db.session.commit()
        app.config["TEST_CHW_ID"] = user.id
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


def test_sync_endpoint_accepts_payload(client, auth_header):
    payload = {
        "last_sync_timestamp": datetime(2024, 1, 1, tzinfo=timezone.utc).isoformat(),
        "changes": {
            "patients": [
                {
                    "id": "patient-1",
                    "demographics": {"name": "John Doe"},
                    "chw_id": client.application.config["TEST_CHW_ID"],
                    "sync_status": "new",
                    "last_modified_at": datetime.now(timezone.utc).isoformat(),
                }
            ],
            "cases": [],
        },
    }
    response = client.post(
        "/api/sync",
        data=json.dumps(payload),
        headers={**auth_header, "Content-Type": "application/json"},
    )
    assert response.status_code == 200
    data = response.get_json()
    assert "new_sync_timestamp" in data
    assert "server_updates" in data
