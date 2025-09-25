from __future__ import annotations

import json
import requests
from celery.utils.log import get_task_logger

from ..extensions import celery_app, db
from ..models import Case, MedGemmaQueue

logger = get_task_logger(__name__)


def create_medgemma_payload(case: Case) -> dict:
    """Create payload for MedGemma model analysis."""
    try:
        triage_data = json.loads(case.triage_data) if case.triage_data else {}
        image_urls = json.loads(case.image_urls) if case.image_urls else []

        payload = {
            "case_id": case.id,
            "patient_id": case.patient_id,
            "chw_id": case.chw_id,
            "risk_level": case.risk_level,
            "triage_data": triage_data,
            "image_urls": image_urls,
            "timestamp": case.created_at.isoformat() if case.created_at else None
        }

        # Add patient demographics if available
        if case.patient and case.patient.demographics:
            try:
                demographics = json.loads(case.patient.demographics)
                payload["patient_demographics"] = demographics
            except json.JSONDecodeError:
                payload["patient_demographics"] = case.patient.demographics

        return payload
    except Exception as e:
        logger.error("Error creating MedGemma payload for case %s: %s", case.id, str(e))
        return {
            "case_id": case.id,
            "error": "Failed to create payload",
            "risk_level": case.risk_level
        }


@celery_app.task(name="tasks.run_medgemma_analysis", bind=True)
def run_medgemma_analysis(self, case_id: str) -> None:
    """Run MedGemma analysis for a high-risk case."""
    case = db.session.get(Case, case_id)
    if not case:
        logger.warning("Case %s not found for MedGemma analysis", case_id)
        return

    queue_entry = db.session.execute(
        db.select(MedGemmaQueue).where(MedGemmaQueue.case_id == case_id)
    ).scalar_one_or_none()

    if queue_entry:
        queue_entry.status = "processing"
        queue_entry.attempts += 1
        db.session.commit()

    try:
        # Create payload for MedGemma
        payload = create_medgemma_payload(case)
        logger.info("Created MedGemma payload for case %s: %s", case_id, payload)

        # TODO: Replace with actual MedGemma API call
        # For now, simulate the API call
        medgemma_url = "https://medgemma-api.example.com/analyze"  # Replace with actual URL

        # Simulate API call (remove this when implementing real API)
        logger.info("Simulating MedGemma API call for case %s", case_id)

        # Mock response - replace with actual API response
        mock_response = {
            "status": "completed",
            "analysis": {
                "diagnosis": "Suspicious melanocytic lesion",
                "confidence": 0.87,
                "recommendations": [
                    "Urgent dermatology consultation recommended",
                    "Biopsy may be required",
                    "Monitor for changes in size/color/shape"
                ],
                "severity_score": 8.5,
                "differential_diagnosis": [
                    "Melanoma",
                    "Atypical nevus",
                    "Seborrheic keratosis"
                ]
            }
        }

        # In real implementation, uncomment this:
        # response = requests.post(medgemma_url, json=payload, timeout=300)
        # response.raise_for_status()
        # medgemma_result = response.json()

        # For now, use mock response
        medgemma_result = mock_response

        # Update case with MedGemma analysis results
        case.ai_analysis = json.dumps(medgemma_result)
        case.status = "PENDING_DIAGNOSIS"

        if queue_entry:
            queue_entry.status = "completed"

        db.session.commit()
        logger.info("MedGemma analysis completed for case %s", case_id)

    except Exception as e:
        logger.error("Error in MedGemma analysis for case %s: %s", case_id, str(e))

        if queue_entry:
            queue_entry.status = "failed"

        # Update case status to indicate analysis failure
        case.status = "ANALYSIS_FAILED"
        case.ai_analysis = json.dumps({
            "status": "failed",
            "error": str(e),
            "attempts": queue_entry.attempts if queue_entry else 1
        })

        db.session.commit()

        # Retry logic - retry up to 3 times
        if queue_entry and queue_entry.attempts < 3:
            logger.info("Retrying MedGemma analysis for case %s (attempt %d)", case_id, queue_entry.attempts)
            # Schedule retry with exponential backoff
            self.retry(countdown=60 * (2 ** queue_entry.attempts), exc=e)
        else:
            logger.error("Max retries exceeded for MedGemma analysis on case %s", case_id)
