from __future__ import annotations

from marshmallow import EXCLUDE, Schema, fields


class SyncEnvelopeSchema(Schema):
    last_sync_timestamp = fields.DateTime(allow_none=True)
    changes = fields.Dict(required=True)

    class Meta:
        unknown = EXCLUDE


class PatientSchema(Schema):
    id = fields.String(required=True)
    demographics = fields.Raw(required=True)  # Allow any type, including strings
    chw_id = fields.String(required=True)
    sync_status = fields.String(required=True)
    last_modified_at = fields.DateTime(required=True)


class CaseSchema(Schema):
    id = fields.String(required=True)
    patient_id = fields.String(required=True)
    chw_id = fields.String(required=True)
    triage_data = fields.Raw(required=True)  # Allow any type, including strings
    ai_analysis = fields.Raw(allow_none=True)  # Allow any type, including strings
    status = fields.String(required=True)
    risk_level = fields.String(required=True)
    image_urls = fields.Raw(required=False)  # Allow any type, including strings
    sync_status = fields.String(required=True)
    last_modified_at = fields.DateTime(required=True)
    created_at = fields.DateTime(required=True)
    patient = fields.Nested(PatientSchema, allow_none=True)


class DiagnosisSchema(Schema):
    id = fields.String(required=True)
    case_id = fields.String(required=True)
    doctor_id = fields.String(required=True)
    diagnosis_text = fields.String(required=True)
    prescription = fields.String(allow_none=True)
    sync_status = fields.String(required=True)
    last_modified_at = fields.DateTime(required=True)


class VitalsSchema(Schema):
    id = fields.String(required=True)
    patient_id = fields.String(required=True)
    chw_id = fields.String(required=True)
    temperature = fields.String(required=True)
    blood_pressure = fields.String(required=True)
    weight = fields.String(required=True)
    notes = fields.String(allow_none=True)
    sync_status = fields.String(required=True)
    last_modified_at = fields.DateTime(required=True)


class MedGemmaQueueSchema(Schema):
    id = fields.String(required=True)
    case_id = fields.String(required=True)
    status = fields.String(required=True)
    attempts = fields.Integer(required=True)
    created_at = fields.DateTime(required=True)
    updated_at = fields.DateTime(required=True)


class SyncResponseSchema(Schema):
    new_sync_timestamp = fields.String(required=True)
    server_updates = fields.Dict(required=True)
