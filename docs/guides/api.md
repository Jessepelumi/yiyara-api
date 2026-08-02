# API Reference Guide

This guide documents the REST API endpoints provided by `apps/api` (Django API) and `apps/decomposer` (Go Engine).

## Base URLs

* **Public REST API**: `http://localhost:8000/api/`
* **Internal API (Django)**: `http://localhost:8000/internal/`
* **Go Decomposer Engine**: `http://localhost:8080/`

---

## Authentication

Public endpoints require JSON Web Token (JWT) authentication passed in the `Authorization` header:
```http
Authorization: Bearer <your_access_token>
```

---

## Public REST API (`apps/api`)

### 1. Goals API

#### List and Create Goals
* **Endpoint**: `GET /api/goals/` | `POST /api/goals/`
* **Auth**: Required (`IsAuthenticated`)

##### `POST /api/goals/` Request Body
```json
{
  "raw_input": "Build a personal portfolio website with project case studies",
  "due_date": "2026-12-31"
}
```

##### Response (`201 Created`)
```json
{
  "id": "e4a2c510-7212-4028-a400-60b13d297920",
  "title": "Build a personal portfolio website with project case studies",
  "description": "",
  "raw_input": "Build a personal portfolio website with project case studies",
  "status": "PROCESSING",
  "due_date": "2026-12-31",
  "is_completed": false,
  "task_count": 0,
  "created_at": "2026-08-02T10:00:00Z",
  "updated_at": "2026-08-02T10:00:00Z",
  "tasks": []
}
```

#### Goal Detail & Deletion
* **Endpoint**: `GET /api/goals/<uuid:pk>/` | `DELETE /api/goals/<uuid:pk>/`
* **Auth**: Required (`IsAuthenticated`)

---

### 2. Conversations API

#### Post Chat Message
* **Endpoint**: `POST /api/conversations/chat/`
* **Auth**: Required (`IsAuthenticated`)

##### Request Body
```json
{
  "goal_id": "e4a2c510-7212-4028-a400-60b13d297920",
  "content": "Can you give me advice on structuring my portfolio case studies?"
}
```

##### Response (`201 Created`)
```json
{
  "conversation_id": "8a719fbc-3021-4f18-b219-c60f27918a51",
  "message": {
    "id": "771a4f02-1200-4e2b-bb99-8d769e120894",
    "role": "model",
    "content": "Sure! Here is a recommended structure for your case studies...",
    "created_at": "2026-08-02T10:05:00Z"
  }
}
```

#### Get Conversation History
* **Endpoint**: `GET /api/conversations/history/<uuid:goal_id>/`
* **Auth**: Required (`IsAuthenticated`)

---

## Inter-Service & Internal APIs

### 1. Go Decomposer Trigger (`apps/decomposer`)

#### Trigger Decomposition
* **Endpoint**: `POST /v1/decompose`
* **Headers**: `X-Internal-Secret: <INTERNAL_AUTH_SECRET>`

##### Request Body
```json
{
  "goal_id": "e4a2c510-7212-4028-a400-60b13d297920",
  "user_id": "1",
  "raw_input": "Build a personal portfolio website",
  "due_date": "2026-12-31"
}
```

##### Response (`202 Accepted`)
```json
{
  "status": "accepted",
  "goal_id": "e4a2c510-7212-4028-a400-60b13d297920"
}
```

---

### 2. Internal Task Ingestion (`apps/api`)

#### Bulk Task Ingestion Endpoint
* **Endpoint**: `POST /internal/goals/<uuid:goal_id>/tasks/`
* **Headers**: `X-Internal-Secret: <INTERNAL_AUTH_SECRET>`

##### Request Body
```json
{
  "title": "Build a Personal Portfolio Website",
  "description": "Comprehensive roadmap for website development",
  "tasks": [
    {
      "title": "Phase 1: Requirements & Case Study Outline",
      "description": "Outline case studies and gather assets",
      "estimated_duration_minutes": 45,
      "order": 0,
      "parent_index": null
    },
    {
      "title": "Phase 2: Frontend Implementation",
      "description": "Build layout components",
      "estimated_duration_minutes": 90,
      "order": 1,
      "parent_index": null
    }
  ]
}
```

##### Response (`201 Created`)
```json
{
  "status": "success",
  "tasks_created": 2
}
```

#### Internal Goal Failure Notification
* **Endpoint**: `POST /internal/goals/<uuid:goal_id>/failed/`
* **Headers**: `X-Internal-Secret: <INTERNAL_AUTH_SECRET>`
```json
{
  "reason": "LLM provider timeout"
}
```
