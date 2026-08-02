package orchestrator

import (
	"context"
	"fmt"
	"strings"
	"time"

	"yiyara-decomposer/internal/contract"
)

// LLMProvider is the "port" that any external model adapter (OpenAI, Gemini) must implement
type LLMProvider interface {
	Name() string
	Decompose(ctx context.Context, req contract.DecompositionRequest) (*contract.TaskNode, error)
}

// EngineDecomposer orchestrates goal breakdown into execution nodes
type EngineDecomposer struct {
	provider LLMProvider
}

func NewEngineDecomposer(provider LLMProvider) *EngineDecomposer {
	return &EngineDecomposer{provider: provider}
}

// RuleBasedProvider serves as a default deterministic provider when external LLM APIs are unconfigured
type RuleBasedProvider struct{}

func NewRuleBasedProvider() *RuleBasedProvider {
	return &RuleBasedProvider{}
}

func (p *RuleBasedProvider) Name() string {
	return "RuleBasedEngine"
}

func (p *RuleBasedProvider) Decompose(ctx context.Context, req contract.DecompositionRequest) (*contract.TaskNode, error) {
	now := time.Now()
	root := &contract.TaskNode{
		ID:          fmt.Sprintf("node-%d", now.UnixNano()),
		Title:       fmt.Sprintf("Deconstructed: %s", req.Prompt),
		Description: fmt.Sprintf("Actionable breakdown generated for: '%s'", req.Prompt),
		Status:      contract.StatusProcessing,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Generate structured subtasks based on domain decomposition patterns
	subtaskTemplates := []struct {
		Title       string
		Description string
		Duration    int
	}{
		{
			Title:       fmt.Sprintf("Phase 1: Analysis & Requirements for '%s'", truncate(req.Prompt, 30)),
			Description: "Gather requirements, scope deliverables, and set milestones.",
			Duration:    45,
		},
		{
			Title:       "Phase 2: Core Execution & Implementation",
			Description: "Execute high-priority items and build core deliverables.",
			Duration:    90,
		},
		{
			Title:       "Phase 3: Review, Testing & Refinement",
			Description: "Validate outputs, test edge cases, and refine final results.",
			Duration:    60,
		},
	}

	for i, t := range subtaskTemplates {
		child := &contract.TaskNode{
			ID:          fmt.Sprintf("node-%d-%d", now.UnixNano(), i+1),
			ParentID:    root.ID,
			Title:       t.Title,
			Description: t.Description,
			Status:      contract.StatusPending,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		root.Children = append(root.Children, child)
	}

	root.Status = contract.StatusCompleted
	return root, nil
}

func truncate(s string, max int) string {
	s = strings.TrimSpace(s)
	if len(s) > max {
		return s[:max] + "..."
	}
	return s
}
