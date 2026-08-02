# Local Setup Guide

This guide provides instructions for setting up the Yiyara development environment.

## Prerequisites

- **Docker** & **Docker Compose** (recommended)
- **Python 3.12+** (for local non-Docker Django development)
- **Go 1.24+** (for local non-Docker Go Decomposer development)
- **PostgreSQL 16** & **Redis 7**

---

## Quickstart via Docker Compose

The fastest way to start all services (PostgreSQL, Redis, Django API, Go Decomposer):

1. **Clone repository and set up environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Start the monorepo stack**:
   ```bash
   make up
   ```

3. **Check running service status**:
   ```bash
   make logs
   ```

4. **Stop the stack**:
   ```bash
   make down
   ```

---

## Service Endpoints & Ports

| Service | Port | Endpoint URL | Description |
| :--- | :--- | :--- | :--- |
| **Django API** | `8000` | `http://localhost:8000` | Core REST API backend |
| **Go Decomposer** | `8080` | `http://localhost:8080` | AI Decomposition microservice |
| **PostgreSQL** | `5432` | `localhost:5432` | Relational Database |
| **Redis** | `6379` | `localhost:6379` | Cache backend |

---

## Manual (Non-Docker) Local Development

### 1. Django API Backend (`apps/api`)

```bash
cd apps/api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### 2. Go Decomposer Engine (`apps/decomposer`)

```bash
cd apps/decomposer

# Build binary
go build -o tmp/main ./cmd/server

# Run server
PORT=8080 API_SERVICE_URL=http://localhost:8000 ./tmp/main
```

---

## Troubleshooting

* **Port Conflicts**: Ensure ports `8000`, `8080`, `5432`, and `6379` are not in use by other local processes.
* **Database Connection Errors**: Verify `PGHOST`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` match your `.env` configuration.
* **Service Inter-Communication**: Ensure `INTERNAL_AUTH_SECRET` matches across `.env` settings for both `api` and `decomposer`.
