# DermaDetect Backend Architecture Implementation Plan

## Overview

DermaDetect implements a sophisticated **offline-first, synchronized system** designed for healthcare environments with intermittent connectivity. The hybrid architecture includes:

1. **Local System** – React Native app with embedded database and AI capabilities.
2. **Cloud System** – Python Flask backend on GCP that serves as the authoritative source.

## Architecture Diagram

```mermaid
graph TD
    subgraph A[Offline System: Mobile Device]
        direction LR
        A1[React Native UI] --> A2{Business Logic};
        A2 --> A3[MedSigLip Triage (TensorFlow.js)];
        A2 --> A4[Local Database (WatermelonDB)];
        A4 --> A5[Offline Job Queue];
    end

    subgraph B[Cloud System: GCP]
        direction LR
        B1[Flask API] --> B2[PostgreSQL Database];
        B1 --> B3[MedGemma Service (Vertex AI)];
        B1 --> B4[Cloud Storage (GCS)];
    end

    A4 -- Syncs via API --> B1;
```

---

## Local System Design (React Native App)

### 1.1 Local Database Schema (WatermelonDB)

#### Synchronization Fields

Every key table requires the following columns for synchronization management:

```javascript
// models/case.js
{
  name: 'sync_status',
  type: 'string',
  isIndexed: true
}, // ENUM: 'new', 'dirty', 'synced'

{
  name: 'last_modified_at',
  type: 'number'
} // Unix timestamp for conflict resolution
```

#### Core Tables

- **patients**
  - id (string, UUID)
  - demographics (JSON)
  - chw_id (string)
  - sync_status
  - last_modified_at

- **cases**
  - id (string, UUID)
  - patient_id (string)
  - triage_data (JSON)
  - ai_analysis (JSON, nullable)
  - status (string) – `TRIAGED`, `PENDING_DIAGNOSIS`, `DIAGNOSED`
  - risk_level (string)
  - image_keys (array of strings)
  - sync_status
  - last_modified_at

- **medgemma_queue**
  - id (string, UUID)
  - case_id (string)
  - status (string) – `queued`, `processing`, `failed`
  - attempts (number)

### 1.2 Offline Job Queue

#### Purpose

Manages background tasks that require cloud connectivity, specifically MedGemma AI analysis for high-risk cases.

#### Workflow for Red Triage

1. CHW completes the red triage flow.
2. Case is saved to the local `cases` table with `sync_status: 'new'`.
3. Entry is created in `medgemma_queue` with `status: 'queued'`.
4. CHW continues working offline without interruption.

### 1.3 Sync Service

#### Dependencies

```bash
npm install @react-native-community/netinfo
```

#### Implementation Notes

- Run a background service that monitors connectivity changes.
- Trigger synchronization when the device comes online.
- Resolve conflicts using `last_modified_at` timestamps.

---

## Cloud System Design (Python Flask Backend)

### 2.1 Database Schema (PostgreSQL)

#### Core Tables (Source of Truth)

- **chw_users**
  - id (UUID, primary key)
  - email (string, unique)
  - hashed_password (string)
  - name (string)
  - created_at (timestamp)

- **patients**
  - id (UUID, primary key)
  - chw_id (UUID, foreign key)
  - demographics (JSONB)
  - created_at (timestamp)
  - updated_at (timestamp)

- **cases**
  - id (UUID, primary key)
  - patient_id (UUID, foreign key)
  - chw_id (UUID, foreign key)
  - triage_data (JSONB)
  - ai_analysis (JSONB, nullable)
  - status (string)
  - risk_level (string)
  - image_urls (array of strings)
  - created_at (timestamp)
  - updated_at (timestamp)

- **diagnoses**
  - id (UUID, primary key)
  - case_id (UUID, foreign key)
  - doctor_id (UUID, foreign key)
  - diagnosis_text (text)
  - prescription (text, nullable)
  - created_at (timestamp)

### 2.2 Synchronization API

#### Endpoint

`POST /api/sync`

#### Request Body Structure

```json
{
  "last_sync_timestamp": 1678886400,
  "changes": {
    "patients": [
      {
        "id": "local_uuid_1",
        "demographics": {},
        "sync_status": "new",
        "last_modified_at": 1678886400
      }
    ],
    "cases": [
      {
        "id": "local_uuid_2",
        "patient_id": "local_uuid_1",
        "triage_data": {},
        "sync_status": "new",
        "last_modified_at": 1678886400
      }
    ]
  }
}
```

#### Response Body Structure

```json
{
  "new_sync_timestamp": 1678889900,
  "server_updates": {
    "cases": [
      {
        "id": "local_uuid_2",
        "ai_analysis": {},
        "status": "PENDING_DIAGNOSIS"
      }
    ],
    "diagnoses": [
      {
        "id": "uuid_4",
        "case_id": "synced_uuid_x",
        "diagnosis_text": "..."
      }
    ]
  }
}
```

#### Sync Logic Flow

1. **Authenticate user** – verify JWT and extract `chw_id`.
2. **Start transaction** – ensure atomic processing of all changes.
3. **Process changes** – upsert records and resolve conflicts via timestamps.
4. **Trigger AI jobs** – queue MedGemma analysis for high-risk cases.
5. **Fetch updates** – gather server-side changes since `last_sync_timestamp`.
6. **Commit transaction** – persist updates and return server payload to the client.

### 2.3 AI Job Processing (Celery)

- **Task**: `perform_ai_analysis`.
- **Input**: `case_id`.
- **Process**: Invoke MedGemma through Vertex AI.
- **Output**: Persist `ai_analysis` results on the corresponding case.

---

## Implementation Phases

### Phase 1: Local Database Foundation

- [ ] Set up WatermelonDB schema with synchronization fields.
- [ ] Implement local CRUD operations.
- [ ] Manage `sync_status` transitions.

### Phase 2: Offline Queue System

- [ ] Create `medgemma_queue` table.
- [ ] Implement queue lifecycle management.
- [ ] Integrate queue updates into the red triage workflow.

### Phase 3: Cloud Backend Foundation

- [ ] Scaffold Flask application and configuration.
- [ ] Implement PostgreSQL models with SQLAlchemy.
- [ ] Build authentication and JWT issuance.

### Phase 4: Synchronization API

- [ ] Implement `POST /api/sync` endpoint.
- [ ] Add upsert logic with conflict resolution.
- [ ] Validate synchronization through integration tests.

### Phase 5: AI Integration

- [ ] Configure Celery workers and broker (e.g., Redis).
- [ ] Connect to MedGemma via Vertex AI.
- [ ] Trigger AI jobs from the sync pipeline.

### Phase 6: Mobile Sync Service

- [ ] Implement connectivity detection using NetInfo.
- [ ] Create synchronization service within the React Native app.
- [ ] Surface conflict resolution status in the UI.

### Phase 7: Testing & Optimization



## Key Technical Considerations

## Implementation Task Breakdown

### Sprint 1 – Local Data Layer

- **Task 1.1** – Scaffold WatermelonDB models
  - Create `patients`, `cases`, and `medgemma_queue` schemas with synchronization fields.
  - Generate model classes and register adapters.
  - Add migration scripts for existing installations.
- **Task 1.2** – CRUD services
  - Implement repository wrappers for adding, updating, and querying records.
  - Centralize timestamp and `sync_status` updates inside service helpers.
  - Unit-test repository logic with mocked WatermelonDB connections.
- **Task 1.3** – Sync metadata utilities
  - Provide helpers to fetch `new`/`dirty` records per table.
  - Implement conflict resolution helper comparing `last_modified_at` values.

### Sprint 2 – Offline Queue & AI Hooks

- **Task 2.1** – Queue management
  - Create queue insertion API invoked by red triage flow.
  - Implement status transitions (`queued` → `processing` → `failed`).
  - Add retry counter and exponential backoff policy.
- **Task 2.2** – Background dispatcher
  - Build background job that scans queue when connectivity resumes.
  - Debounce executions to avoid repeated sync triggers.
  - Log telemetry for monitoring (success/failure counts).
- **Task 2.3** – Integration tests
  - Simulate triage submissions offline and validate queue contents.
  - Ensure queue drains correctly once mock network connectivity is restored.

### Sprint 3 – Flask Backend Foundation

- **Task 3.1** – Project bootstrap
  - Initialize Flask app, configuration modules, and environment management.
  - Set up SQLAlchemy models mirroring the schema above.
  - Configure Alembic migrations.
- **Task 3.2** – Authentication
  - Implement JWT issuance and verification middlewares.
  - Add password hashing and login endpoints for CHWs and doctors.
  - Write unit tests covering auth edge cases (expired token, invalid signature).
- **Task 3.3** – Storage services
  - Encapsulate database access in repository classes (patients, cases, diagnoses).
  - Provide bulk upsert operations with transaction scopes.
  - Build helper to fetch updates filtered by timestamp.

### Sprint 4 – Synchronization Pipeline

- **Task 4.1** – `/api/sync` endpoint
  - Define request/response schemas with Marshmallow or Pydantic.
  - Implement change processing loop with conflict resolution.
  - Return server-side updates and new sync timestamp.
- **Task 4.2** – File handling & GCS integration
  - Accept image metadata and upload tokens from client payloads.
  - Store asset URLs in `cases.image_urls`.
  - Implement signed URL generation for secure downloads.
- **Task 4.3** – Integration tests
  - Mock client payloads with mixed `new`/`dirty` records.
  - Validate idempotency by replaying the same payload.
  - Ensure server updates propagate back to client fixtures.

### Sprint 5 – AI Orchestration

- **Task 5.1** – Celery setup
  - Configure Celery app, Redis broker, and worker deployment scripts.
  - Implement `perform_ai_analysis` task and result persistence.
  - Add retries and dead-letter queue handling for Vertex AI errors.
- **Task 5.2** – Vertex AI integration
  - Wrap MedGemma inference calls with robust error handling.
  - Capture inference metadata (latency, confidence scores).
  - Securely manage service account credentials.
- **Task 5.3** – Pipeline wiring
  - Trigger Celery tasks from `/api/sync` for high-risk cases.
  - Publish task status updates to monitoring dashboards.
  - Backfill AI results into `server_updates` payload during sync.

### Sprint 6 – Mobile Sync Experience

- **Task 6.1** – Connectivity watcher
  - Integrate NetInfo event listeners and expose online/offline state.
  - Persist last sync attempt metadata for diagnostics.
  - Display offline banners and sync status to the user.
- **Task 6.2** – Sync executor
  - Serialize change payloads from local services and call `/api/sync`.
  - Apply server updates transactionally in WatermelonDB.
  - Update queue entries based on AI processing statuses.
- **Task 6.3** – Error handling UX
  - Surface conflicts or sync failures with actionable messages.
  - Provide manual retry controls for CHWs.
  - Track sync history for troubleshooting (timestamps, record counts).

### Sprint 7 – Validation & Deployment

- **Task 7.1** – End-to-end scenarios
  - Run full offline-to-online workflows with seed data.
  - Validate multi-device conflicts (two CHWs editing same patient).
  - Ensure doctor-side UIs receive updates promptly.
- **Task 7.2** – Performance & load testing
  - Benchmark sync payload sizes and response times.
  - Stress-test Celery workers with batched high-risk cases.
  - Profile database queries and add indexes as needed.
- **Task 7.3** – Deployment readiness
  - Create infrastructure-as-code templates (Terraform or Cloud Deployment Manager).
  - Set up CI/CD pipelines for mobile and backend components.
  - Document runbooks for on-call and incident response.

### Conflict Resolution

- Use last-write-wins with `last_modified_at` timestamps.
- Treat server AI outputs as authoritative.
- Maintain pending local changes until confirmed by sync.

### Data Integrity

- Wrap sync operations in database transactions.
- Utilize UUIDs to prevent key collisions.
- Apply atomic updates for related entities.

### Performance

- Consolidate changes in a single sync request.
- Index `sync_status` and timestamp fields for fast queries.
- Offload expensive AI processing to background workers.

### Security

- Require JWT authentication on every API call.
- Encrypt sensitive patient data at rest and in transit.
- Manage service credentials securely (e.g., GCP Secret Manager).

### Scalability

- Scale Flask services horizontally behind a load balancer.
- Utilize database connection pooling and read replicas if needed.
- Serve media through Cloud Storage and CDN caching.
