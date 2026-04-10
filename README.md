# Zimna AI

This documentation was created using an LLM, so I'll be making edits gradually.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Zimna is an AI-powered life planning and goal management platform designed to help users turn long-term aspirations into clear, actionable steps. Using advanced AI technology, Zimna transforms vague goals into SMART (Specific, Measurable, Actionable, Realistic, Time-bound) objectives with detailed task breakdowns.

## 🌟 Features

- **AI-Powered Goal Processing**: Convert natural language goals into structured SMART goals
- **Intelligent Task Generation**: Automatically break down goals into actionable, time-bound tasks
- **Interactive Goal Console**: Real-time chat interface for goal refinement and follow-up questions
- **Multi-Provider AI Support**: Choose between Google Gemini and OpenAI ChatGPT
- **Persistent Conversations**: Full chat history tracking with context-aware AI responses
- **Intent Classification**: Intelligent routing for decompose/query/chat operations
- **Progress Tracking**: Monitor goal completion and task status with real-time updates
- **Advanced Dashboard**: Interactive console, goal list with task expansion, and objectives overview
- **User Authentication**: Secure email-based accounts with JWT authentication
- **Responsive Web Interface**: Modern, mobile-friendly dashboard built with Next.js and TypeScript
- **Docker Containerization**: Easy deployment with Docker Compose
- **PostgreSQL Database**: Robust data storage with Neon Postgres integration

## 🏗️ Architecture

Zimna is built as a full-stack application with:

- **Backend**: Django REST Framework with multi-provider AI integration
  - AI Workflow Engine: Orchestrates goal decomposition and task generation
  - Conversations Module: Manages multi-turn AI dialogues with context preservation
  - Support for Google Gemini and OpenAI ChatGPT AI providers
- **Frontend**: Next.js with TypeScript, React Query, and Tailwind CSS
  - Interactive Console: Real-time goal management interface
  - Dashboard: Goals list, objectives overview, and task management
  - Type-safe API integration with error handling
- **Database**: PostgreSQL (hosted on Neon)
  - Email-based user authentication
  - Hierarchical goal-task relationships
  - Persistent conversation history per goal
- **Deployment**: Docker Compose for containerized development and deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- Neon PostgreSQL account (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/zimna.git
   cd zimna
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Database Configuration (from Neon)
   PGHOST=your-neon-host
   PGDATABASE=your-database-name
   PGUSER=your-username
   PGPASSWORD=your-password
   PGPORT=5432

   # AI Configuration
   GEMINI_API_KEY=your-gemini-api-key

   # Django Configuration
   DEBUG=True
   SECRET_KEY=your-django-secret-key
   ```

3. **Start the application**

   ```bash
   make build
   make up
   ```

4. **Run database migrations**

   ```bash
   make migrate
   ```

5. **Create a superuser**
   ```bash
   make superuser
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## ✨ Recent Enhancements

### Interactive Console & Conversations

- Real-time chat interface for goal refinement and follow-ups
- Persistent multi-turn conversations with full history per goal
- Intelligent intent classification (decompose/query/chat)

### Multi-Provider AI Support

- Seamlessly switch between Google Gemini and OpenAI ChatGPT
- Provider-agnostic architecture for easy extensibility
- Environment-based configuration—no code changes required

### Enhanced Dashboard

- **Console**: Interactive interface for active goal management
- **Goals List**: Searchable, sortable with expandable task details
- **Objectives Overview**: High-level progress tracking
- Example prompts to guide new users

### Advanced Frontend Stack

- React Query for optimized data fetching and caching
- React Table for feature-rich data tables with sorting/filtering
- Type-safe API integration with comprehensive error handling
- NextAuth integration for enterprise-grade authentication

### Robust Backend

- Atomic database transactions for data consistency
- Conversation service with context-aware response routing
- Goal decomposition workflow with automatic task generation
- Email-based authentication with JWT tokens

## 📖 Usage

### Creating Goals

1. Navigate to the Goals section in the dashboard
2. Describe your goal in natural language (e.g., "I want to learn Spanish and become conversational")
3. Zimna's AI will process your input and create:
   - A SMART goal with clear objectives
   - Actionable tasks with deadlines
   - Progress tracking capabilities

### Using the Interactive Console

1. Navigate to the Console section to interact with a specific goal
2. Ask follow-up questions about your goal for refinement
3. The system supports:
   - **Decompose Intent**: Breaks vague goals into actionable steps
   - **Query Intent**: Retrieves relevant goals and tasks (RAG-ready)
   - **Chat**: General contextual responses with full conversation history
4. View complete chat history for each goal
5. Goal and task details are automatically updated based on conversation

### Managing Tasks

- View all tasks associated with your goals
- Mark tasks as completed
- Track progress towards goal completion
- Set due dates and priorities
- View tasks in expandable goal cards or advanced data tables

## 🛠️ Development

### Available Commands

```bash
# Docker Management
make up             # Start all containers
make down           # Stop all containers
make build          # Rebuild containers
make restart        # Restart services
make logs           # View backend logs

# Django Management
make migrate        # Run database migrations
make superuser      # Create admin user
make shell          # Open Django shell
make collectstatic  # Collect static files

# Cleanup
make clean          # Remove containers and volumes (destructive)
```

### Project Structure

```bash
zimna/
├── backend/              # Django REST API
│   ├── config/           # Django settings & ASGI/WSGI config
│   ├── ai/               # AI Engine Integration
│   │   ├── providers/    # Multiple AI provider implementations
│   │   │   ├── gemini_provider.py
│   │   │   └── chatgpt_provider.py
│   │   └── prompts/      # Prompt templates
│   │       └── goal_decomposition_prompt.py
│   ├── workflow/         # AI orchestration engine
│   │   └── ai_engine.py  # Goal decomposition workflow
│   ├── goals/            # Goal management app
│   ├── tasks/            # Task management app
│   ├── conversations/    # Chat & messaging module
│   │   ├── models.py     # Conversation & Message models
│   │   ├── services.py   # AI intent routing logic
│   │   ├── views.py      # Chat API endpoints
│   │   └── serializers.py
│   ├── users/            # User authentication & management
│   ├── requirements.txt   # Python dependencies
│   └── manage.py
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js app router with route groups
│   │   │   ├── (auth)/   # Authentication routes (login)
│   │   │   └── (dashboard)/
│   │   │       ├── console/      # ⭐ Interactive goal console
│   │   │       ├── goals/        # Goals list & management
│   │   │       ├── objectives/   # Objectives overview
│   │   │       └── home/         # Dashboard home
│   │   ├── components/   # Reusable UI components
│   │   │   ├── custom/
│   │   │   │   ├── goalAccordion.tsx    # Expandable goal cards
│   │   │   │   ├── goalTile.tsx         # Goal card display
│   │   │   │   ├── sidebar.tsx          # Navigation sidebar
│   │   │   │   ├── statusIndicator.tsx  # Status badges
│   │   │   │   ├── datatable.tsx        # Advanced data table
│   │   │   │   └── examplePrompt.tsx    # Example goal prompts
│   │   │   ├── providers/        # Context providers
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useChat.ts        # Chat state management
│   │   │   ├── useGoals.ts       # Goals data fetching
│   │   │   └── useDeleteGoal.ts  # Goal deletion logic
│   │   ├── lib/                  # Utilities & API helpers
│   │   ├── static/               # Static data
│   │   │   └── examplePrompts.tsx # Pre-built example goals
│   │   └── types/                # TypeScript type definitions
│   ├── ARCHITECTURE.md   # Comprehensive frontend documentation
│   ├── package.json      # Node.js dependencies
│   └── next.config.ts    # Next.js configuration
├── docs/                 # Documentation & guides
│   └── guides/
│       ├── ai-configuration.md   # AI provider setup guide
│       ├── neon.md               # Database configuration
│       ├── deployment.md
│       ├── development.md
│       └── setup.md
├── docker-compose.yml    # Multi-container orchestration
├── Makefile              # Development commands
└── README.md
```

### Backend Development

The backend is built with Django and Django REST Framework. Key components:

**AI Engine & Workflow** (`backend/workflow/` & `backend/ai/`):

- **{ZimnaWorkflow}** class: Orchestrates full goal decomposition pipeline
  - Natural language to SMART goal conversion
  - Atomic database transactions for consistency
  - Automatic task and conversation generation
  - Multi-provider AI support (Gemini, ChatGPT)
- **AI Providers**: Abstracted provider interface
  - Google Gemini provider with intent classification
  - OpenAI ChatGPT provider (alternative option)
  - Extensible for future AI integrations
- **Prompt Templates**: Goal decomposition and intent classification prompts

**Conversations Module** (`backend/conversations/`):

- **Message Routing**: Intelligent intent classification system
  - **DECOMPOSE**: Breaks vague goals into actionable steps
  - **QUERY**: Retrieves relevant goals/tasks (RAG-ready architecture)
  - **DEFAULT**: Contextual conversational responses with history
- **Persistent Chat**: Full message threading per goal
  - `Conversation` model: Links chat sessions to goals
  - `Message` model: Role-based messages (user/assistant/system)
- **Chat API**: Stateful endpoints for real-time conversations

**Authentication & Users**:

- Email-based user authentication (not username)
- JWT tokens for secure API access
- User model enhanced with verification and demographics

**Database**:

- PostgreSQL with Django ORM
- Hierarchical relationships: User → Goal → Task → Messages
- Indexed fields for optimal query performance

### Frontend Development

The frontend uses modern React patterns with Next.js and TypeScript:

**Technology Stack**:

- **Next.js 16**: App router with route groups and server components
- **TypeScript**: Comprehensive type safety
- **Tailwind CSS**: Utility-first styling with modern PostCSS
- **React Query (TanStack Query)**: Server state management and caching
- **React Table (TanStack Table)**: Advanced data table features
- **shadcn/ui**: Accessible component library built on Radix UI
- **Phosphor Icons** + **Lucide Icons**: Consistent iconography
- **NextAuth**: Authentication with Django backend integration

**Key Pages & Features**:

- **Console** (`/dashboard/console`): Interactive real-time chat interface for active goal management
- **Goals** (`/dashboard/goals`): List view with expandable task details using accordion component
- **Objectives** (`/dashboard/objectives`): Overview and analytics page (future expansion)
- **Home** (`/dashboard/home`): Landing with example prompts and goal input helper

**Custom Hooks**:

- `{useChat}`: Chat state management with API communication
- `{useGoals}`: Fetch and cache user's goals with React Query
- `{useDeleteGoal}`: Deletion logic with optimistic updates

**Advanced Components**:

- `{goalAccordion}`: Expandable goal cards with nested tasks
- `{datatable}`: Advanced table for goals/tasks with sorting and filtering
- `{statusIndicator}`: Visual status badges for tasks/goals
- `{promptField}`: Specialized input for natural language prompts
- `{examplePrompt}`: Interactive example goal cards

**State Management**:

- React Query for server state (goals, tasks, conversations)
- Local state for UI interactions and forms
- NextAuth for authentication state

**API Integration**:

- Type-safe fetch utilities in `lib/api/`
- Error handling and retry logic
- Request/response interceptors for authentication

## 🤖 AI Integration

Zimna features advanced AI capabilities with multi-provider support:

**Goal Decomposition Pipeline**:

1. **Natural Language Processing**: Understands vague goal descriptions
2. **SMART Goal Conversion**: Transforms inputs into Specific, Measurable, Actionable, Realistic, Time-bound goals
3. **Task Breakdown**: Generates detailed, actionable tasks with deadlines
4. **Date Intelligence**: Converts relative dates ("next week") to absolute dates

**Multi-Provider AI Support**:

- **Google Gemini** (Primary): Advanced language understanding and structured output
- **OpenAI ChatGPT** (Alternative): Flexible NLP with chat capabilities
- **Abstracted Provider Interface**: Easy switching and extensibility
- Configure via environment variables (`GEMINI_API_KEY` or `OPENAI_API_KEY`)

**Intent Classification System**:

- Automatically routes requests to appropriate handlers:
  - **Goal Decomposition**: Breaks down vague goals into structured steps
  - **Query Processing**: Retrieves relevant goals and tasks (RAG-ready)
  - **Conversational Response**: Context-aware answers using chat history
- Enables smarter, more contextual interactions

**Conversation Context**:

- Full chat history preservation per goal
- Multi-turn dialogue support
- System messages for context and guardrails
- Atomic operations ensure data consistency

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/login/` - User login with email
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh

### Goal Management Endpoints

- `GET /api/goals/` - List user's goals with nested tasks
- `POST /api/goals/` - Create new goal manually
- `POST /api/decompose/` - ⭐ Convert natural language to SMART goals and tasks (AI-powered)
- `GET /api/goals/{id}/` - Get specific goal with all details
- `PUT /api/goals/{id}/` - Update goal
- `DELETE /api/goals/{id}/` - Delete goal and related data

### Task Endpoints

- `GET /api/tasks/` - List user's tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

### Conversation & Chat Endpoints

- `POST /api/conversations/chat/` - ⭐ Send message to AI assistant
  - Auto-creates conversation linked to goal
  - Supports intent routing (decompose/query/chat)
  - Returns AI response with context
- `GET /api/conversations/history/{goal_id}/` - Retrieve full chat history for a goal
  - Returns all messages with roles (user/assistant/system)
  - Enables context reconstruction for follow-ups

### Response Features

- **Error Handling**: Clarification prompts when AI needs more information
- **Contextual Responses**: AI uses full chat history for intelligent replies
- **Automatic Record Creation**: Goals and tasks created atomically from conversations
- **Intent Classification**: Routing for decomposition, queries, and general chat

## 🔧 Configuration

### Environment Variables

| Variable              | Description                               | Required                   | Default                 |
| --------------------- | ----------------------------------------- | -------------------------- | ----------------------- |
| `PGHOST`              | PostgreSQL host                           | Yes                        | -                       |
| `PGDATABASE`          | Database name                             | Yes                        | -                       |
| `PGUSER`              | Database username                         | Yes                        | -                       |
| `PGPASSWORD`          | Database password                         | Yes                        | -                       |
| `PGPORT`              | Database port                             | Yes                        | 5432                    |
| `GEMINI_API_KEY`      | Google Gemini API key (or use ChatGPT)    | Conditional (one required) | -                       |
| `OPENAI_API_KEY`      | OpenAI ChatGPT API key                    | Conditional                | -                       |
| `AI_PROVIDER`         | Active AI provider (`gemini` or `openai`) | No                         | `gemini`                |
| `DEBUG`               | Django debug mode                         | No                         | False                   |
| `SECRET_KEY`          | Django secret key                         | Yes                        | -                       |
| `ALLOWED_HOSTS`       | Comma-separated allowed hosts             | No                         | `localhost`             |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL                     | No                         | `http://localhost:8000` |
| `BASE_URL`            | Backend service URL                       | No                         | `http://backend:8000`   |

### AI Provider Configuration

**Google Gemini** (Default):

```bash
GEMINI_API_KEY=your-gemini-api-key
AI_PROVIDER=gemini
```

**OpenAI ChatGPT**:

```bash
OPENAI_API_KEY=your-openai-api-key
AI_PROVIDER=openai
```

Switching between providers doesn't require any code changes—configure via environment variables.

## 🏛️ Architecture Patterns & Design

### Key Architectural Decisions

**Atomic Database Transactions**:

- Goal creation in `ZimnaWorkflow` is transactional
- Ensures Goal + Tasks + Conversation all succeed or all fail
- Prevents orphaned records on failure
- Maintains data consistency across AI-driven operations

**Intent Classification**:

- Router service distinguishes between request types:
  - **Decompose**: Convert goals to tasks (primary workflow)
  - **Query**: Retrieve relevant goals/tasks (RAG foundation)
  - **Chat**: Contextual responses using history
- Enables intelligent request routing without separate endpoints

**Multi-Provider Abstraction**:

- Provider interface allows easy switching between AI services
- Each provider implements consistent contract (class methods)
- Config-based selection (no code changes needed)
- Extensible for future AI providers

**Conversation-as-Context**:

- Every message links to a goal
- Full message history enables follow-ups without re-context
- System messages provide guardrails
- Audit trail of goal evolution

**Type-Safe Frontend**:

- Comprehensive TypeScript types throughout
- NextAuth for type-safe authentication
- React Query for typed API responses
- Catch errors at compile time

**Stateful Conversations**:

- Chat state managed with `useChat` hook
- Optimistic updates for better UX
- Persistent history per goal
- Context-aware AI responses

### Database Relationships

```
User
├── Goal (with raw_input, created_at, updated_at)
│   ├── Task (with due_date, completed, created_at)
│   └── Conversation
│       └── Message[] (role: user/assistant/system)
```

All relationships are lazy-loaded and indexed for performance.

## 🚀 Deployment

### Production Build

1. **Build frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Configure production environment**
   - Set `DEBUG=False`
   - Configure production database
   - Set secure `SECRET_KEY`

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Environment Setup

For production deployment, ensure:

- SSL/TLS certificates configured
- Environment variables secured
- Database backups configured
- Monitoring and logging set up

## 📚 Comprehensive Documentation

Zimna includes detailed guides for various aspects:

- **[AI Configuration Guide](docs/guides/ai-configuration.md)**: Setup and switching between Google Gemini and OpenAI ChatGPT
- **[Frontend Architecture](frontend/ARCHITECTURE.md)**: In-depth guide covering routes, components, auth flow, state management, and API integration
- **[Neon Database Setup](docs/guides/neon.md)**: PostgreSQL configuration and connection pooling
- **[Development Guide](docs/guides/development.md)**: Local development workflow and best practices
- **[Deployment Guide](docs/guides/deployment.md)**: Production setup and considerations
- **[Setup Guide](docs/guides/setup.md)**: Initial project setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend code
- Write tests for new features
- Update documentation for API changes
- Ensure Docker compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini & OpenAI** for advanced AI capabilities with multi-provider support
- **Django & DRF** for robust and scalable backend framework
- **Next.js** for modern frontend and server-side rendering capabilities
- **React Query (TanStack Query)** for powerful server state management
- **shadcn/ui & Radix UI** for accessible component primitives
- **Neon** for managed PostgreSQL hosting with connection pooling
- **NextAuth** for seamless authentication integration

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Zimna AI** - Transform your aspirations into achievements.
