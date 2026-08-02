# Variables
BINARY_NAME=yiyara-decomposer
DOCKER_COMPOSE=docker compose

.PHONY: help up down restart build logs shell clean test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Start the engine container in development mode with live-reload
	$(DOCKER_COMPOSE) up --build

down: ## Stop and remove active containers
	$(DOCKER_COMPOSE) down

restart: ## Hard restart the development stack
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

build: ## Run a fresh docker build clearing out the builder cache
	$(DOCKER_COMPOSE) build --no-cache

logs: ## Follow container logs in real time
	$(DOCKER_COMPOSE) logs -f engine

shell: ## Drop directly inside the running development container shell
	$(DOCKER_COMPOSE) exec engine /bin/sh

clean: ## Purge local compilation tmp files and dangling docker cache layers
	rm -rf tmp
	docker system prune -f --filter "label=stage=builder"

test: ## Run unit tests inside the container runtime environment
	$(DOCKER_COMPOSE) exec engine go test -v ./...