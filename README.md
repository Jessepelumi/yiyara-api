# Zimna AI

This documentation was created using an LLM, so I'll be making edits gradually.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Zimna is an AI-powered life planning and goal management platform designed to help users turn long-term aspirations into clear, actionable steps. Using advanced AI technology, Zimna transforms vague goals into SMART (Specific, Measurable, Actionable, Realistic, Time-bound) objectives with detailed task breakdowns.

## 🌟 Features

- **AI-Powered Goal Processing**: Convert natural language goals into structured SMART goals
- **Intelligent Task Generation**: Automatically break down goals into actionable, time-bound tasks
- **Progress Tracking**: Monitor goal completion and task status
- **User Authentication**: Secure user accounts with JWT authentication
- **Responsive Web Interface**: Modern, mobile-friendly dashboard built with Next.js
- **Docker Containerization**: Easy deployment with Docker Compose
- **PostgreSQL Database**: Robust data storage with Neon Postgres integration

## 🏗️ Architecture

Zimna is built as a full-stack application with:

- **Backend**: Django REST Framework with AI integration (Google Gemini)
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL (hosted on Neon)
- **AI Engine**: Google Gemini for natural language processing and goal structuring
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

## 📖 Usage

### Creating Goals

1. Navigate to the Goals section in the dashboard
2. Describe your goal in natural language (e.g., "I want to learn Spanish and become conversational")
3. Zimna's AI will process your input and create:
   - A SMART goal with clear objectives
   - Actionable tasks with deadlines
   - Progress tracking capabilities

### Managing Tasks

- View all tasks associated with your goals
- Mark tasks as completed
- Track progress towards goal completion
- Set due dates and priorities

## 🛠️ Development

### Available Commands

```bash
# Docker Management
make up          # Start all containers
make down        # Stop all containers
make build       # Rebuild containers
make restart     # Restart services
make logs        # View backend logs

# Django Management
make migrate     # Run database migrations
make superuser   # Create admin user
make shell       # Open Django shell
make collectstatic  # Collect static files

# Cleanup
make clean       # Remove containers and volumes (destructive)
```

### Project Structure

```bash
zimna/
├── backend/              # Django REST API
│   ├── config/           # Django settings
│   ├── goals/            # Goal management app
│   ├── tasks/            # Task management app
│   ├── users/            # User authentication
│   ├── workflow/         # AI processing engine
│   └── requirements.txt
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   └── components/   # Reusable UI components
│   └── package.json
├── docs/                 # Documentation
├── docker-compose.yml    # Container orchestration
├── Makefile              # Development commands
└── README.md
```

### Backend Development

The backend is built with Django and Django REST Framework. Key components:

- **AI Engine**: Processes natural language into structured goals using Google Gemini
- **REST API**: Provides endpoints for goals, tasks, and user management
- **Authentication**: JWT-based user authentication
- **Database**: PostgreSQL with Django ORM

### Frontend Development

The frontend uses modern React patterns:

- **Next.js 16**: App router with server components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible component library
- **Phosphor Icons**: Consistent iconography

## 🤖 AI Integration

Zimna uses Google Gemini to intelligently process user goals:

1. **Natural Language Processing**: Understands vague goal descriptions
2. **SMART Goal Conversion**: Transforms inputs into Specific, Measurable, Actionable, Realistic, Time-bound goals
3. **Task Breakdown**: Generates detailed, actionable tasks
4. **Date Intelligence**: Converts relative dates ("next week") to absolute dates

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh

### Goal Endpoints

- `GET /api/goals/` - List user goals
- `POST /api/goals/` - Create new goal
- `GET /api/goals/{id}/` - Get specific goal
- `PUT /api/goals/{id}/` - Update goal
- `DELETE /api/goals/{id}/` - Delete goal

### Task Endpoints

- `GET /api/tasks/` - List user tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PUT /api/tasks/{id}/` - Update task
- `DELETE /api/tasks/{id}/` - Delete task

## 🔧 Configuration

### Environment Variables

| Variable         | Description           | Required            |
| ---------------- | --------------------- | ------------------- |
| `PGHOST`         | PostgreSQL host       | Yes                 |
| `PGDATABASE`     | Database name         | Yes                 |
| `PGUSER`         | Database username     | Yes                 |
| `PGPASSWORD`     | Database password     | Yes                 |
| `PGPORT`         | Database port         | Yes                 |
| `GEMINI_API_KEY` | Google Gemini API key | Yes                 |
| `DEBUG`          | Django debug mode     | No (default: False) |
| `SECRET_KEY`     | Django secret key     | Yes                 |

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

- Google Gemini for AI capabilities
- Django and DRF for robust backend framework
- Next.js for modern frontend development
- Neon for managed PostgreSQL hosting

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Zimna AI** - Transform your aspirations into achievements.
