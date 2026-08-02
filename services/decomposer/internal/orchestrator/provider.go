package orchestrator

import (
	"context"
	"yiyara-decomposer/internal/contract"
)

// LLMProvider is the "port" that any external model adapter (OpenAI, Gemini) must implement
type LLMProvider interface {
	Name() string
	Decompose(ctx context.Context, req contract.DecompositionRequest) (*contract.TaskNode, error)
}
