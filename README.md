# Yiyara Monorepo

Yiyara is an AI-powered goal breakdown and task execution engine. This monorepo hosts the complete system architecture separated into focused, dedicated microservices.

## Monorepo Directory Layout

```text
yiyara/
├── apps/
│   ├── api/            # Django API Service
│   └── decomposer/     # Go Decomposer Engine
├── docs/
│   └── guides/         # System & Deployment Guides
├── scripts/            # Repo Automation Scripts
├── shared/
│   └── contracts/      # OpenAPI/JSON Schemas
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

## Quickstart (Local Development)

### Prerequisites
* Docker & Docker Compose
* Go 1.24+ (optional for local non-Docker development)
* Python 3.12+ (optional for local non-Docker development)

### Running with Docker Compose
To build and start all services (PostgreSQL, Redis, API, Decomposer):

```bash
make up
```

View live service logs:
```bash
make logs
```

Stop services:
```bash
make down
```

---

## Running Unit Tests

To run all unit tests across services:
```bash
make test
```

Or run tests per service:
```bash
make test-api         # Python/Django tests
make test-decomposer  # Go tests
```
