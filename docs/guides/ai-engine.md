# AI Engine & Provider Guide

This guide explains the AI provider integration, prompt orchestration, and decomposition engine mechanics in Yiyara.

## AI Architecture Overview

Yiyara splits AI responsibilities across two layers:

1. **AI Providers (Django `apps/api/apps/ai`)**:
   * Interfaces with Google Gemini (`GeminiProvider`) and OpenAI (`ChatGPTProvider`) SDKs.
   * Handles chat intent classification (`DECOMPOSE`, `QUERY`, `CHAT`) and conversational memory formatting.

2. **Go Decomposer Microservice (`apps/decomposer`)**:
   * High-performance Go microservice engine (`Yiyara Decomposition Engine`).
   * Receives decomposition requests from Django API (`POST /v1/decompose`).
   * Implements `LLMProvider` interface (`internal/orchestrator/provider.go`).
   * Deconstructs raw user ambitions into structured `TaskNode` trees and posts results back to Django for atomic DB persistence.

---

## Environment Configuration

Set the relevant API keys in your root `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
INTERNAL_AUTH_SECRET=your_shared_internal_secret
```

---

## Intent Classification & Conversation Memory

When a user sends a message to `POST /api/conversations/chat/`:

1. `GeminiProvider.classify_intent(raw_text)` categorizes user input into one of three intents:
   * **`DECOMPOSE`**: Triggers `workflow.create_goals_from_ai()`.
   * **`QUERY`**: Queries goal/task state.
   * **`CHAT`**: Fetches past conversation history (up to last 10 messages) formatted as `{"role": "user"|"model", "parts": [...]}` and generates a context-aware AI response.

---

## Decomposition Data Models in Go

The Go engine defines recursive tree nodes in `apps/decomposer/internal/contract/schemas.go`:

```go
type TaskNode struct {
	ID          string      `json:"id"`
	ParentID    string      `json:"parent_id,omitempty"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Status      TaskStatus  `json:"status"`
	Children    []*TaskNode `json:"children,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}
```

The Go engine converts these `TaskNode` trees into `BulkTaskIngestionPayload` items, mapping parent-child relationships via `parent_index`, and sends them to Django's internal ingestion API.
