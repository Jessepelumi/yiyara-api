.PHONY: help up down logs test test-api test-decomposer build clean

help:
	@echo "Yiyara Monorepo Management Commands:"
	@echo "  make up               Start all services with docker-compose"
	@echo "  make down             Stop all services"
	@echo "  make logs             Tail logs from all services"
	@echo "  make test             Run test suites across all services"
	@echo "  make test-api         Run Django unit tests"
	@echo "  make test-decomposer  Run Go unit tests"
	@echo "  make build            Build docker containers"
	@echo "  make clean            Remove build and cache artifacts"

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

test: test-api test-decomposer

test-api:
	cd apps/api && python manage.py test

test-decomposer:
	cd apps/decomposer && go test ./...

build:
	docker compose build

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf apps/decomposer/tmp
