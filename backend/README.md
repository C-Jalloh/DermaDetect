# DermaDetect Backend

This directory contains the offline-first synchronization backend for the DermaDetect mobile application. The service is built with Flask and SQLAlchemy, follows the architecture described in `docs/backend-implementation-plan.md`, and exposes a single `/api/sync` endpoint for bidirectional data exchange.

## Features

- Offline-first synchronization API with timestamp-based conflict resolution.
- PostgreSQL-ready schema (SQLite used for local development).
- Background AI orchestration hooks for MedSigLip (local inference) and MedGemma (cloud).
- Celery integration scaffold for asynchronous AI jobs.
- Modular service layer with Marshmallow schemas and repositories.

## Getting Started

### 1. Environment Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
```

Update `.env` with appropriate values (database URL, JWT secret, Redis URL, etc.).

### 2. Database Migration

For local development, run the bootstrap script to create tables:

```bash
python manage.py create-db
```

### 3. Run the API Server

```bash
python manage.py run
```

The server will start on `http://127.0.0.1:5000` by default.

### 4. Run Celery Worker (Optional)

```bash
celery -A app.tasks worker --loglevel=info
```

### 5. Run Tests

```bash
pytest
```

## Project Structure

```text
backend/
├── README.md
├── requirements.txt
├── env.example
├── manage.py
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   └── sync.py
│   ├── services/
│   │   ├── sync_service.py
│   │   └── repository.py
│   └── ai/
│       ├── __init__.py
│       ├── medsiglip.py
│       └── tasks.py
└── tests/
    ├── __init__.py
    └── test_sync_endpoint.py
```

## Notes

- SQLite is configured by default. Swap `DATABASE_URL` in `.env` with a PostgreSQL URI for production.
- The MedSigLip module contains a placeholder inference routine to simulate local triage scoring; integrate the actual TensorFlow.js or converted model when available.
- Celery configuration is optional for local development. The sync endpoint gracefully no-ops task dispatching when the worker is unavailable (logged warning).
