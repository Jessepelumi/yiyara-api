# Zimna AI

Zimna AI is a personalized productivity application that helps users break down their goals into actionable objectives and tasks using AI-powered goal decomposition.

## Features

- **Goal Input**: Enter your goals in natural language
- **AI Decomposition**: Automatically break down goals into manageable objectives and tasks
- **Dashboard**: View and manage your goals and objectives with interactive tables
- **AI Chat Console**: Interact with AI to refine goals and get guidance
- **Authentication**: Secure Google OAuth login with session management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: TanStack React Query 5 for server state
- **Tables**: TanStack React Table 8 for advanced data display
- **Authentication**: NextAuth.js with Google OAuth provider
- **Icons**: Phosphor Icons
- **Backend**: REST API integration with Django backend
- **UI Components**: Radix UI primitives via shadcn

## Documentation

### Quick Start

For installation and running locally, see the [Getting Started](#getting-started) section below.

### Architecture & System Design

For a comprehensive explanation of how everything works together, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

This document covers:

- Complete architecture overview and design patterns
- Detailed file-by-file breakdown
- Component hierarchy and relationships
- Data flow and state management
- API integration and authentication system
- Key interactions and workflows
- Complete walkthroughs of user flows

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zimna-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BACKEND_URL=http://localhost:8000
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

The frontend is organized into clear folders:

- `src/app/` - Pages and routing
- `src/components/` - Reusable React components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities and API client
- `src/types/` - TypeScript definitions
- `src/static/` - Static data files

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown of every file.

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test components and API integrations
5. Update documentation as needed

## License

This project is private and proprietary.
