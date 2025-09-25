from __future__ import annotations

from datetime import datetime
from typing import Iterable, Sequence

from sqlalchemy import select

from ..extensions import db
from ..models import Case, Diagnosis, Patient

SYNCABLE_MODELS = {
    "patients": Patient,
    "cases": Case,
    "diagnoses": Diagnosis,
}


class Repository:
    def __init__(self, model):
        self.model = model

    def upsert_records(self, payloads: Sequence[dict]) -> None:
        for data in payloads:
            record = db.session.get(self.model, data["id"])
            if record:
                incoming_modified = data.get("last_modified_at")
                if incoming_modified and incoming_modified <= record.last_modified_at:
                    continue
                for key, value in data.items():
                    if hasattr(record, key) and key not in {"created_at", "id"}:
                        setattr(record, key, value)
            else:
                db.session.add(self.model(**data))

    def fetch_modified_since(self, timestamp: datetime | None) -> list[dict]:
        stmt = select(self.model)
        if timestamp:
            stmt = stmt.where(self.model.last_modified_at > timestamp)
        results = db.session.execute(stmt).scalars().all()
        return [self.to_dict(row) for row in results]

    def to_dict(self, instance) -> dict:
        data = {
            column.name: getattr(instance, column.name)
            for column in instance.__table__.columns
        }
        return data


def get_repository(collection: str) -> Repository:
    model = SYNCABLE_MODELS.get(collection)
    if not model:
        raise ValueError(f"Unknown collection: {collection}")
    return Repository(model)
