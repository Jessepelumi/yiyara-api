# System Architecture Guide

This guide details the architectural design, service boundaries, and asynchronous execution loop of the Yiyara platform.

## Overview

Yiyara is built as a polyglot monorepo split into two focused microservices:

```text
+-------------------------------------------------------------------+
|                        Client Applications                        |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP REST / JWT Auth
                                  v
+-------------------------------------------------------------------+
|                     Django REST API (apps/api)                    |
|  - Auth & User Management (JWT)                                   |
|  - DB Storage (Goals, Tasks, Conversations, Messages)             |
|  - Async Trigger Handoff                                          |
+-------------------------------------------------------------------+
          |                                               ^
          | POST /v1/decompose                            | POST /internal/goals/{id}/tasks/
          | (X-Internal-Secret)                           | (X-Internal-Secret)
          v                                               |
+-------------------------------------------------------------------+
|                  Go Decomposer Engine (apps/decomposer)          |
|  - HTTP Trigger Ingestion                                         |
|  - LLM Orchestration / Rule-Based Prompt Decomposition            |
|  - Async Bulk Task Tree Posting                                   |
+-------------------------------------------------------------------+
```

---

## Service Responsibilities

### 1. `apps/api` (Python 3.12 / Django 6.0)
* Serves the public REST API for frontend client applications.
* Manages relational storage in PostgreSQL (Users, Goals, Tasks, Conversations, Messages).
* Handles JWT authentication via `djangorestframework-simplejwt`.
* Initiates goal decomposition requests asynchronously to `apps/decomposer` and provides internal endpoints for bulk task ingestion.

### 2. `apps/decomposer` (Go 1.24)
* Microservice dedicated to goal-to-task tree decomposition.
* Receives raw input triggers (`POST /v1/decompose`), processes task graph algorithms, and returns computed task structures.
* Communicates back to `apps/api` via internal bulk ingestion APIs.

---

## Asynchronous Decomposition Sequence

1. **Client Request**: User posts a raw text prompt to `POST /api/goals/` on the Django API.
2. **Goal State `PROCESSING`**: Django creates a `Goal` record in PostgreSQL with `status=PROCESSING`.
3. **Trigger Handoff**: Django sends an HTTP POST request to `http://decomposer:8080/v1/decompose` with payload:
   ```json
   {
     "goal_id": "<uuid>",
     "user_id": "<user_id>",
     "raw_input": "User goal description",
     "due_date": null
   }
   ```
4. **Immediate Acceptance**: Go Decomposer validates the `X-Internal-Secret` header and immediately responds with `202 Accepted`.
5. **Background Processing**: Go Decomposer executes prompt decomposition routines asynchronously in a goroutine.
6. **Task Ingestion**: Go Decomposer posts the resulting task tree back to `POST /internal/goals/<uuid>/tasks/` on the Django API.
7. **Goal State `ACTIVE`**: Django saves the task hierarchy inside an atomic database transaction and updates goal `status=ACTIVE`. (If decomposition fails, Go calls `/internal/goals/<uuid>/failed/` updating `status=FAILED`).

---

## Inter-Service Security

Inter-service communication between `apps/api` and `apps/decomposer` is secured via an internal shared secret header:
```http
X-Internal-Secret: <INTERNAL_AUTH_SECRET>
```
Endpoints under `/internal/` on the API service and `/v1/decompose` on the Decomposer service reject requests that lack a matching `X-Internal-Secret`.
