package contract

import "time"

// TaskStatus defines the immutable state of an execution node
type TaskStatus string

const (
	StatusPending    TaskStatus = "PENDING"
	StatusProcessing TaskStatus = "PROCESSING"
	StatusCompleted  TaskStatus = "COMPLETED"
	StatusFailed     TaskStatus = "FAILED"
)

// TaskNode represents a single recursive node in Yiyara's execution tree
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

// DecompositionRequest defines the incoming payload for a decomposition job
type DecompositionRequest struct {
	GoalId string `json:"goal_id"`
	Prompt     string `json:"prompt"`
	MaxDepth   int    `json:"max_depth"`
}

// DecompositionResponse defines the final structured output sent back or pushed to the queue
type DecompositionResponse struct {
	GoalId string    `json:"goal_id"`
	RootTask   *TaskNode `json:"root_task"`
	DurationMs int64     `json:"duration_ms"`
}
