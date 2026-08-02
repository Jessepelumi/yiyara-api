# Database & Cache Guide

This guide documents the relational database configuration, database models schema, and caching infrastructure for Yiyara.

## Relational Database (PostgreSQL / Neon)

Yiyara uses **PostgreSQL 16** (or Neon Serverless Postgres in production) as its primary relational database.

### Environment Configuration

Database connection settings are loaded dynamically from environment variables in `apps/api/config/settings.py`:

```env
PGHOST=postgres
PGDATABASE=yiyara_db
PGUSER=yiyara
PGPASSWORD=yiyara_password
PGPORT=5432
```

For Neon Serverless Postgres integration:
* `OPTIONS`: `{"sslmode": "require"}`
* `DISABLE_SERVER_SIDE_CURSORS`: `True`
* `CONN_HEALTH_CHECKS`: `True`

---

## Data Models & Relational Schema

```text
+-------------------+           +-------------------+
|     User          | 1       * |       Goal        |
| (custom auth)     |<----------| - id (UUID)       |
+-------------------+           | - title           |
                                | - status          |
                                | - raw_input       |
                                +-------------------+
                                  | 1             | 1
                                  |               |
                                  | *             | *
                                  v               v
                        +-------------------+  +-------------------+
                        |       Task        |  |   Conversation    |
                        | - id (UUID)       |  | - id (UUID)       |
                        | - title           |  +-------------------+
                        | - parent (self)   |            | 1
                        +-------------------+            | *
                                                         v
                                               +-------------------+
                                               |      Message      |
                                               | - role            |
                                               | - content         |
                                               +-------------------+
```

### Model Definitions Summary (`apps/api/apps/`)

1. **`User`** (`users/models.py`):
   * Custom user model extending Django AbstractUser with email/username auth.

2. **`Goal`** (`goals/models.py`):
   * `id`: UUID (Primary Key)
   * `user`: ForeignKey -> `User`
   * `title`: CharField(255)
   * `description`: TextField
   * `raw_input`: TextField
   * `status`: CharField choices (`PROCESSING`, `ACTIVE`, `COMPLETED`, `ARCHIVED`, `FAILED`)
   * `due_date`: DateField (optional)
   * `is_completed`: BooleanField

3. **`Task`** (`tasks/models.py`):
   * `id`: UUID (Primary Key)
   * `goal`: ForeignKey -> `Goal` (related_name `'tasks'`)
   * `title`: CharField(255)
   * `description`: TextField
   * `parent`: ForeignKey -> `self` (optional recursive subtask tree link)
   * `estimated_duration_minutes`: IntegerField (default 30)
   * `order`: IntegerField (default 0)
   * `is_completed`: BooleanField

4. **`Conversation`** & **`Message`** (`conversations/models.py`):
   * `Conversation`: Links a user and a goal to a chat thread.
   * `Message`: Chronological messages in thread (`role` choices: `'user'`, `'assistant'`, `'system'`, `'model'`).

---

## Redis Cache Configuration

Yiyara uses **Redis 7** for caching and throttle state management:

```env
REDIS_URL=redis://redis:6379/1
```

Configured in `apps/api/config/settings.py` via `django-redis`:
* **Throttle Rates**:
  * `otp_send`: `3/min`
  * `otp_verify`: `10/min`
  * `login`: `10/min`
