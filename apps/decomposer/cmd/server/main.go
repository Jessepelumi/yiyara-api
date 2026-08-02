package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"yiyara-decomposer/internal/contract"
	"yiyara-decomposer/internal/orchestrator"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	apiServiceURL := os.Getenv("API_SERVICE_URL")
	if apiServiceURL == "" {
		apiServiceURL = "http://localhost:8000"
	}
	apiServiceURL = strings.TrimRight(apiServiceURL, "/")

	internalSecret := os.Getenv("INTERNAL_AUTH_SECRET")

	provider := orchestrator.NewRuleBasedProvider()

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status": "healthy",
			"engine": "Yiyara Decomposition Engine",
		})
	})

	// Decomposition trigger endpoint (called by Django API)
	mux.HandleFunc("POST /v1/decompose", func(w http.ResponseWriter, r *http.Request) {
		if internalSecret != "" {
			clientSecret := r.Header.Get("X-Internal-Secret")
			if clientSecret != internalSecret {
				http.Error(w, `{"error":"Unauthorized internal request"}`, http.StatusUnauthorized)
				return
			}
		}

		var payload contract.DecompositionTriggerPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, `{"error":"Invalid JSON payload"}`, http.StatusBadRequest)
			return
		}

		if payload.GoalID == "" || payload.RawInput == "" {
			http.Error(w, `{"error":"goal_id and raw_input are required"}`, http.StatusBadRequest)
			return
		}

		// Acknowledge receipt immediately (202 Accepted) and process asynchronously
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "accepted",
			"goal_id": payload.GoalID,
		})

		// Asynchronous processing loop
		go processDecomposition(apiServiceURL, internalSecret, provider, payload)
	})

	log.Printf("Yiyara Decomposer Engine starting on :%s...", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

func processDecomposition(apiURL, secret string, provider orchestrator.LLMProvider, payload contract.DecompositionTriggerPayload) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	log.Printf("[Decomposer] Processing goal decomposition for goal_id=%s, input='%s'", payload.GoalID, payload.RawInput)

	req := contract.DecompositionRequest{
		AmbitionId: payload.GoalID,
		Prompt:     payload.RawInput,
		MaxDepth:   3,
	}

	rootNode, err := provider.Decompose(ctx, req)
	if err != nil {
		log.Printf("[Decomposer] Error decomposing goal %s: %v", payload.GoalID, err)
		notifyGoalFailure(apiURL, secret, payload.GoalID, err.Error())
		return
	}

	// Convert TaskNode tree into BulkTaskIngestionPayload
	ingestionPayload := contract.BulkTaskIngestionPayload{
		Title:       rootNode.Title,
		Description: rootNode.Description,
		Tasks:       make([]contract.IngestionTaskItem, 0, len(rootNode.Children)),
	}

	for idx, child := range rootNode.Children {
		ingestionPayload.Tasks = append(ingestionPayload.Tasks, contract.IngestionTaskItem{
			Title:                    child.Title,
			Description:              child.Description,
			EstimatedDurationMinutes: 45,
			Order:                    idx,
		})
	}

	// Post results back to Django API
	targetEndpoint := fmt.Sprintf("%s/internal/goals/%s/tasks/", apiURL, payload.GoalID)
	jsonBytes, err := json.Marshal(ingestionPayload)
	if err != nil {
		log.Printf("[Decomposer] Failed to marshal ingestion payload: %v", err)
		notifyGoalFailure(apiURL, secret, payload.GoalID, err.Error())
		return
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", targetEndpoint, bytes.NewBuffer(jsonBytes))
	if err != nil {
		log.Printf("[Decomposer] Failed to create HTTP request: %v", err)
		notifyGoalFailure(apiURL, secret, payload.GoalID, err.Error())
		return
	}

	httpReq.Header.Set("Content-Type", "application/json")
	if secret != "" {
		httpReq.Header.Set("X-Internal-Secret", secret)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("[Decomposer] Failed posting tasks back to Django API: %v", err)
		notifyGoalFailure(apiURL, secret, payload.GoalID, err.Error())
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[Decomposer] Successfully ingested tasks for goal_id=%s (HTTP %d)", payload.GoalID, resp.StatusCode)
	} else {
		log.Printf("[Decomposer] Django API ingestion endpoint returned HTTP %d for goal_id=%s", resp.StatusCode, payload.GoalID)
	}
}

func notifyGoalFailure(apiURL, secret, goalID, reason string) {
	targetEndpoint := fmt.Sprintf("%s/internal/goals/%s/failed/", apiURL, goalID)
	body, _ := json.Marshal(map[string]string{"reason": reason})

	req, err := http.NewRequest("POST", targetEndpoint, bytes.NewBuffer(body))
	if err != nil {
		return
	}

	req.Header.Set("Content-Type", "application/json")
	if secret != "" {
		req.Header.Set("X-Internal-Secret", secret)
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err == nil {
		resp.Body.Close()
	}
}
