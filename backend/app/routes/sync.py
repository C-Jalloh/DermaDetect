from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..schemas import SyncEnvelopeSchema, SyncResponseSchema
from ..services.sync_service import SyncService

sync_bp = Blueprint("sync", __name__)
service = SyncService()
envelope_schema = SyncEnvelopeSchema()
response_schema = SyncResponseSchema()


@sync_bp.route("/sync", methods=["POST"])
@jwt_required()
def sync_endpoint():
    payload = request.get_json(force=True)
    data = envelope_schema.load(payload)
    chw_id = get_jwt_identity()
    result = service.process_sync_payload(data, chw_id)
    return jsonify(response_schema.dump(result)), 200
