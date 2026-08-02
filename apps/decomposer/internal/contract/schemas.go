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
	AmbitionId string `json:"ambition_id"`
	Prompt     string `json:"prompt"`
	MaxDepth   int    `json:"max_depth"`
}

// DecompositionResponse defines the final structured output sent back or pushed to the queue
type DecompositionResponse struct {
	AmbitionId string    `json:"ambition_id"`
	RootTask   *TaskNode `json:"root_task"`
	DurationMs int64     `json:"duration_ms"`
}

// DecompositionTriggerPayload is sent by Django API when a goal is created
type DecompositionTriggerPayload struct {
	GoalID   string  `json:"goal_id"`
	UserID   string  `json:"user_id"`
	RawInput string  `json:"raw_input"`
	DueDate  *string `json:"due_date,omitempty"`
}

// IngestionTaskItem represents a single task in the bulk ingestion payload sent to Django
type IngestionTaskItem struct {
	Title                    string `json:"title"`
	Description              string `json:"description"`
	EstimatedDurationMinutes int    `json:"estimated_duration_minutes"`
	Order                    int    `json:"order"`
	ParentIndex              *int   `json:"parent_index,omitempty"`
}

// BulkTaskIngestionPayload is posted by Go engine back to Django's internal ingestion endpoint
type BulkTaskIngestionPayload struct {
	Title       string              `json:"title,omitempty"`
	Description string              `json:"description,omitempty"`
	Tasks       []IngestionTaskItem `json:"tasks"`
}
