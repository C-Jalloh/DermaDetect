from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import db
from ..models import MedGemmaQueue
from .repository import SYNCABLE_MODELS, get_repository


class SyncService:
    def __init__(self):
        self.repositories = {
            name: get_repository(name) for name in SYNCABLE_MODELS.keys()
        }

    def process_sync_payload(self, data: dict, chw_id: str) -> dict:
        changes = data.get("changes", {})
        timestamp = data.get("last_sync_timestamp")
        if isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp)

        try:
            for collection, payloads in changes.items():
                if collection not in self.repositories:
                    continue
                normalized = [self._normalize_payload(p, chw_id, collection) for p in payloads]
                self.repositories[collection].upsert_records(normalized)

            self._enqueue_high_risk_cases(changes.get("cases", []))
            db.session.commit()
        except SQLAlchemyError as exc:
            db.session.rollback()
            raise exc

        new_sync_timestamp = datetime.now(timezone.utc)
        server_updates = self._collect_server_updates(timestamp)
        return {
            "new_sync_timestamp": new_sync_timestamp.isoformat(),
            "server_updates": server_updates,
        }

    def _normalize_payload(self, payload: dict, chw_id: str, collection: str) -> dict:
        normalized = payload.copy()
        if collection in {"patients", "cases"}:
            normalized.setdefault("chw_id", chw_id)
        if "last_modified_at" in normalized and isinstance(
            normalized["last_modified_at"], str
        ):
            normalized["last_modified_at"] = datetime.fromisoformat(
                normalized["last_modified_at"]
            )
        if collection == "cases" and isinstance(normalized.get("image_urls"), list):
            normalized["image_urls"] = ",".join(normalized["image_urls"])
        if collection == "cases" and isinstance(normalized.get("triage_data"), dict):
            normalized["triage_data"] = json_dump(normalized["triage_data"])
        if collection == "cases" and isinstance(normalized.get("ai_analysis"), dict):
            normalized["ai_analysis"] = json_dump(normalized["ai_analysis"])
        if collection == "patients" and isinstance(normalized.get("demographics"), dict):
            normalized["demographics"] = json_dump(normalized["demographics"])
        if collection == "diagnoses" and isinstance(
            normalized.get("prescription"), (dict, list)
        ):
            normalized["prescription"] = json_dump(normalized["prescription"])
        return normalized

    def _collect_server_updates(self, timestamp: datetime | None) -> dict:
        updates = {}
        for collection, repo in self.repositories.items():
            records = repo.fetch_modified_since(timestamp)
            if not records:
                continue
            normalized_records = []
            for record in records:
                record = record.copy()
                if collection == "cases" and record.get("image_urls"):
                    record["image_urls"] = record["image_urls"].split(",")
                for key in ("triage_data", "ai_analysis", "demographics", "prescription"):
                    if record.get(key):
                        record[key] = try_json_load(record[key])
                for key in ("created_at", "updated_at", "last_modified_at"):
                    if record.get(key):
                        record[key] = ensure_isoformat(record[key])
                normalized_records.append(record)
            updates[collection] = normalized_records
        return updates

    def _enqueue_high_risk_cases(self, cases: list[dict]) -> None:
        for case_payload in cases:
            if case_payload.get("risk_level", "").lower() != "high":
                continue
            stmt = select(MedGemmaQueue).where(
                MedGemmaQueue.case_id == case_payload["id"]
            )
            queue_entry = db.session.execute(stmt).scalar_one_or_none()
            if queue_entry:
                continue
            new_entry = MedGemmaQueue(case_id=case_payload["id"])
            db.session.add(new_entry)


def ensure_isoformat(value) -> str:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()
    if isinstance(value, str):
        return value
    return str(value)


def json_dump(value) -> str:
    from json import dumps

    return dumps(value, default=str)


def try_json_load(value: str):
    from json import JSONDecodeError, loads

    try:
        return loads(value)
    except (TypeError, JSONDecodeError):
        return value
