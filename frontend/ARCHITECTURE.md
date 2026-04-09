# Zimna AI - Frontend Architecture & System Overview

This document provides a comprehensive explanation of how the Zimna AI frontend works, what each component does, and how everything connects together. This is essential reading for developers who need to understand the system's architecture and design patterns.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [API Integration](#api-integration)
6. [Dependencies and Imports](#dependencies-and-imports)
7. [Key Interactions](#key-interactions)
8. [Authentication System](#authentication-system)
9. [State Management](#state-management)

---

## Architecture Overview

Zimna AI uses a **Next.js 16 App Router** architecture with modern React patterns. The application is built with the following principles:

### Tech Stack

- **Next.js 16** with TypeScript and React 19
- **TailwindCSS 4** for styling
- **next-auth** for authentication with Django backend bridge
- **TanStack React Query 5** for server state management
- **TanStack React Table 8** for advanced table functionality
- **Radix UI & shadcn** components for UI primitives
- **Phosphor Icons** for icon system

### Core Patterns

- **Route Groups**: `(auth)`, `(dashboard)` for logical organization without affecting URLs
- **Server-side Middleware**: Route protection and authentication checks
- **Provider Pattern**: Dual wrappers (NextAuth + React Query) for global app context
- **Custom Hooks**: Encapsulate API data fetching with React Query
- **API Proxy Layer**: All frontend API calls route through Next.js to the Django backend
- **Component Composition**: Reusable UI components with clear responsibilities

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Application (Next.js)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Root Layout + Providers                 │   │
│  │  ┌────────────────┐   ┌──────────────────────┐  │   │
│  │  │ NextAuthProvider│   │  QueryProvider       │  │   │
│  │  │ (SessionProvider)   │  (QueryClientProvider) │   │
│  │  └────────────────┘   └──────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Route Groups & Pages                         │   │
│  │  ┌──────────┐  ┌────────────────────────────┐   │   │
│  │  │ (auth)   │  │ (dashboard)                │   │   │
│  │  │ login    │  │ ├── home (goal creation)   │   │   │
│  │  └──────────┘  │ ├── goals (dashboard)      │   │   │
│  │  ┌──────────┐  │ ├── console (AI chat)      │   │   │
│  │  │ Landing  │  │ └── objectives             │   │   │
│  │  └──────────┘  └────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Components Layer                             │   │
│  │  ├── Custom Components                          │   │
│  │  ├── UI Components (shadcn)                     │   │
│  │  └── Providers                                  │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Data Layer                                   │   │
│  │  ├── API Client (apiClient with auth)           │   │
│  │  ├── API Endpoints (goals, chat)                │   │
│  │  └── Custom Hooks (useGoals, useChat)           │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Next.js API Routes (Middleware Layer)        │   │
│  │  ├── Proxy Route: /api/[...path]                │   │
│  │  └── Auth Route: /api/auth/[...nextauth]        │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓                                              │
└─────────────────────────────────────────────────────────┘
           ↓
      [Django Backend API]
      /decompose/
      /list/
      /conversations/chat/
      /users/auth/bridge/
```

---

## Project Structure

```
src/
├── middleware.ts
│   └── Route protection middleware that redirects unauthenticated users to login
│
├── app/
│   ├── globals.css
│   │   └── Global CSS styles applied to the entire application
│   │
│   ├── layout.tsx
│   │   └── Root layout that wraps the entire app with QueryProvider and NextAuthProvider
│   │
│   ├── page.tsx
│   │   └── Landing page with authentication check; routes to /home if authenticated, /login otherwise
│   │
│   ├── (auth)/
│   │   └── login/page.tsx
│   │       └── Google OAuth login page with NextAuth integration
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   │   └── Dashboard layout with sidebar navigation (desktop fixed, mobile drawer)
│   │   │       & header with user profile
│   │   │
│   │   ├── home/page.tsx
│   │   │   └── Goal creation page where users enter goals for AI decomposition
│   │   │       - Displays example prompts
│   │   │       - Text input for custom goal entry
│   │   │       - Triggers goalsApi.decompose() mutation
│   │   │
│   │   ├── goals/page.tsx
│   │   │   └── Goals dashboard displaying all user goals with their tasks
│   │   │       - Fetches goals using useGoals() hook
│   │   │       - Maps goals to expandable GoalAccordion components
│   │   │       - Each accordion contains a DataTable of tasks
│   │   │
│   │   ├── goals/taskColumns.tsx
│   │   │   └── Column definition for the task DataTable
│   │   │       - Columns: Title, Description, Due Date, Status
│   │   │       - Uses custom components for each cell type
│   │   │
│   │   ├── console/page.tsx
│   │   │   └── Console root page (no goal selected)
│   │   │       - Redirects to first goal's console if goals exist
│   │   │       - Shows empty state if no goals
│   │   │       - Provides navigation to goals page
│   │   │
│   │   ├── console/[id]/page.tsx
│   │   │   └── Dynamic console page for specific goal
│   │   │       - Fetches chat history for the goal
│   │   │       - Displays conversation with AI
│   │   │       - Allows sending new messages
│   │   │       - Manages optimistic UI updates
│   │   │
│   │   └── objectives/page.tsx
│   │       └── Objectives page (placeholder for future feature)
│   │
│   └── api/
│       ├── [...path]/route.ts
│       │   └── Catch-all proxy route that forwards all /api/* requests to Django backend
│       │       - Adds Authorization header with JWT token
│       │       - Handles response from backend
│       │
│       └── auth/[...nextauth]/route.ts
│           └── NextAuth authentication handler
│               - Configures Google OAuth provider
│               - Handles sign-in callback to exchange creds for Django JWT
│               - Manages session and JWT callbacks
│
├── components/
│   ├── custom/
│   │   ├── datatable.tsx
│   │   │   └── Reusable TanStack React Table wrapper component
│   │   │       - Accepts columns and data props
│   │   │       - Provides sorting, filtering, selection capabilities
│   │   │       - Used for displaying task list in goals page
│   │   │
│   │   ├── examplePrompt.tsx
│   │   │   └── Card component displaying example AI prompts
│   │   │       - Used on home page to guide users
│   │   │       - Clicking a prompt pre-fills the input field
│   │   │
│   │   ├── goalAccordion.tsx
│   │   │   └── Accordion component for expanding/collapsing goal details
│   │   │       - Header shows goalTile with title and task count
│   │   │       - Body contains DataTable of tasks
│   │   │       - Toggles task visibility on click
│   │   │       - Integrates useDeleteGoal hook for goal deletion
│   │   │
│   │   ├── goalTile.tsx
│   │   │   └── Individual goal card/tile display component
│   │   │       - Shows goal title with task badge count
│   │   │       - Delete goal button with confirmation dialog
│   │   │       - "Open in Console" button for AI chat navigation
│   │   │
│   │   ├── promptField.tsx
│   │   │   └── Reusable textarea input component for AI prompts
│   │   │       - Enter to submit, Shift+Enter for newlines
│   │   │       - Microphone & attachment button placeholders
│   │   │       - Used in both home and console pages
│   │   │
│   │   ├── sectionHeader.tsx
│   │   │   └── Section title/header component with consistent styling
│   │   │
│   │   ├── sidebar.tsx
│   │   │   └── Navigation sidebar for dashboard
│   │   │       - Desktop: fixed left sidebar (collapsible)
│   │   │       - Mobile: hidden drawer opened on menu button
│   │   │       - Navigation items: Home, Goals, Console, Objectives
│   │   │       - Logout button
│   │   │
│   │   ├── sidebarItem.tsx
│   │   │   └── Individual navigation item (link) in sidebar
│   │   │       - Uses usePathname() to detect active route
│   │   │       - Highlights active item with blue background
│   │   │
│   │   ├── statusIndicator.tsx
│   │   │   └── Visual indicator component for task status
│   │   │       - Displays status badge (pending, completed, etc.)
│   │   │
│   │   └── tableRowTitle.tsx
│   │       └── Title cell for table rows with custom styling
│   │
│   ├── providers/
│   │   ├── NextAuthProvider.tsx
│   │   │   └── Wraps app with NextAuth SessionProvider
│   │   │       - Makes session available to all child components
│   │   │       - Provides useSession() hook throughout app
│   │   │
│   │   └── QueryProvider.tsx
│   │       └── TanStack/React Query provider and configuration
│   │           - Configures QueryClient with 60s staleTime
│   │           - Enables Query DevTools in development
│   │
│   └── ui/
│       └── Base UI components from shadcn/ui:
│           ├── badge.tsx - Label/badge component
│           ├── button.tsx - Button with variants
│           ├── checkbox.tsx - Checkbox input
│           ├── field.tsx - Form field wrapper
│           ├── input-otp.tsx - OTP input for 2FA
│           ├── input.tsx - Text input
│           ├── label.tsx - Form label
│           ├── separator.tsx - Divider line
│           ├── sheet.tsx - Off-canvas panel (mobile drawer)
│           ├── skeleton.tsx - Loading skeleton component
│           └── table.tsx - Table component
│
├── hooks/
│   └── useGoals.ts
│       └── Custom React Query hook for fetching goals
│           - Uses useQuery to fetch goals on mount
│           - Returns { data, isLoading, error }
│           - Automatically caches and revalidates data
│   └── useDeleteGoal.ts
│       └── Custom React Query hook for deleting goals
│           - Uses useMutation to delete a goal by ID
│           - Invalidates goals query on success
│           - Handles error logging
│   └── useChat.ts
│       └── Custom React Query hook for chat functionality
│           - Manages conversation state and message sending
│           - Tracks active conversation ID
│           - Handles optimistic UI updates
│
├── lib/
│   ├── utils.ts
│   │   └── General utility functions
│   │       - cn() helper for merging Tailwind class names
│   │
│   └── api/
│       ├── client.ts
│       │   └── Core HTTP client (apiClient function)
│       │       - Base function for all API requests
│       │       - Automatically adds Authorization header from NextAuth session
│       │       - Handles 401 (unauthorized) errors by signing out
│       │       - All requests go through /api proxy route
│       │
│       ├── goals.ts
│       │   └── Goals API functions
│       │       - decompose(text): POST to /decompose/
│       │       - list(): GET to /list/
│       │
│       └── types.ts
│           └── TypeScript interfaces and types
│               - Goal: { id, title, description, due_date, tasks }
│               - Task: { id, title, description, is_completed, due_date }
│
├── static/
│   ├── examplePrompts.tsx
│   │   └── Array of example prompts shown on home page
│   │
│   └── tasks_task.json
│       └── Sample task data for testing/demo
│
└── types/
    └── next-auth.d.ts
        └── NextAuth type augmentation
            - Extends Session type to include accessToken
            - Extends User type to include accessToken and refreshToken
```

---

## Component Hierarchy

### Page Structure & Routing

```
Root Layout (layout.tsx)
├── NextAuthProvider (provides session context)
│   └── QueryProvider (provides React Query context)
│       │
│       ├── (auth) Route Group
│       │   ├── login/page.tsx ← Not authenticated users see this
│       │   │   └── Email OTP authentication form (in progress)
│       │   │
│       │   │
│       ├── page.tsx ← Landing/public page
│       │   └── "Start Now" button
│       │       ├── Routes to /home if authenticated (useSession check)
│       │       └── Routes to /login if not authenticated
│       │
│       │
│       └── (dashboard) Route Group ← Protected by middleware.ts
│           └── layout.tsx ← Dashboard Layout
│               ├── Sidebar Component
│               │   ├── sidebarItem.tsx (Home)
│               │   ├── sidebarItem.tsx (Goals)
│               │   ├── sidebarItem.tsx (Console)
│               │   └── Logout button
│               │
│               └── Main Content Area
│                   │
│                   ├── home/page.tsx ← Goal Creation Page
│                   │   ├── sectionHeader.tsx
│                   │   ├── examplePrompt.tsx (multiple)
│                   │   │   └── Click → useCallback → setInputValue
│                   │   ├── promptField.tsx (textarea)
│                   │   │   └── Enter → handleSubmit()
│                   │   └── useMutation(goalsApi.decompose)
│                   │       └── On success: todo (show toast, redirect)
│                   │
│                   │
│                   ├── goals/page.tsx ← Goals Dashboard
│                   │   ├── useGoals() hook
│                   │   │   └── useQuery(['goals']) with goalsApi.list()
│                   │   │
│                   │   ├── Loading state (spinner message)
│                   │   │
│                   │   └── goals.map(goal →
│                   │       goalAccordion.tsx
│                   │       ├── Header: goalTile.tsx
│                   │       │   ├── Title with badge (task count)
│                   │       │   ├── Delete button
│                   │       │   └── "Open in Console" button
│                   │       │
│                   │       └── Body (collapsible):
│                   │           datatable.tsx
│                   │           ├── Powered by TanStack React Table
│                   │           ├── Data: goal.tasks array
│                   │           ├── Columns: taskColumns.tsx
│                   │           │   ├── Title (tableRowTitle.tsx)
│                   │           │   ├── Description
│                   │           │   ├── Due Date
│                   │           │   └── Status (statusIndicator.tsx)
│                   │           │
│                   │           └── Features: sorting, selection
│                   │
│                   │
│                   ├── console/page.xyz ← AI Chat Console
│                   │   ├── [goalId] from params/search
│                   │   ├── useChat(goalId) hook
│                   │   │   └── useMutation(sendChatMessage)
│                   │   │
│                   │   ├── Message List
│                   │   │   ├── User message → blue bubble (right)
│                   │   │   └── AI response → gray bubble (left)
│                   │   │
│                   │   └── promptField.tsx
│                   │       └── On submit → mutation.mutate(content)
│                   │           ├── First message: includes goal_id
│                   │           └── Subsequent: uses conversation_id
│                   │
│                   │
│                   └── objectives/page.tsx ← Placeholder
│                       └── sectionHeader.tsx (Coming Soon)
```

### Component Dependencies

```
Pages depend on:
├── home/page.tsx
│   ├── promptField.tsx (UI)
│   ├── examplePrompt.tsx (custom)
│   ├── button.tsx (UI)
│   └── goalsApi from lib/api/goals.ts
│
├── goals/page.tsx
│   ├── goalAccordion.tsx (custom)
│   │   ├── goalTile.tsx (custom)
│   │   │   ├── Delete button with confirmation
│   │   │   └── "Open in Console" navigation
│   │   └── datatable.tsx (custom)
│   │       └── taskColumns.tsx (column definitions)
│   │           ├── tableRowTitle.tsx
│   │           ├── statusIndicator.tsx
│   │           └── badge.tsx (UI)
│   ├── useGoals hook
│   ├── useDeleteGoal hook
│   └── sectionHeader.tsx (custom)
│
├── console/page.tsx ← Root console page
│   ├── useGoals hook (to check for goals)
│   ├── Redirects to console/[firstGoalId] if goals exist
│   ├── Shows empty state UI if no goals
│   └── Navigation button to goals page
│
└── console/[id]/page.tsx ← Dynamic console page
    ├── useChat hook for sending messages
    ├── useQuery for fetching chat history
    ├── promptField.tsx (UI) for input
    ├── Optimistic UI updates for messages
    └── Message list display
```

---

## Data Flow

### 1. Authentication Flow (Complete Journey)

```
Step 1: Landing Page (page.tsx)
  ├── useSession() checks if user is authenticated
  ├── Renders "Start Now" button
  └── Button click routes to:
      ├── /home if user.session exists (authenticated)
      └── /login if session is null (not authenticated)

Step 2: Login Page (login/page.tsx)
  ├── Displays "Continue with Google" button
  └── onClick → signIn("google", { callbackUrl: "/home" })
      └── Triggers NextAuth Google OAuth flow

Step 3: NextAuth Handler (app/api/auth/[...nextauth]/route.ts)
  ├── Receives Google OAuth code from callback
  ├── On signIn callback:
  │   ├── Validates Google credentials
  │   ├── Makes request to Django bridge: POST /users/auth/bridge/
  │   │   └── Sends: { email, first_name, last_name }
  │   ├── Receives: { access: JWT_token, refresh: JWT_token }
  │   └── Attaches tokens to user object
  │
  ├── On JWT callback:
  │   ├── token.accessToken = user.access
  │   ├── token.refreshToken = user.refresh
  │   └── Store in JWT
  │
  └── On Session callback:
      ├── session.accessToken = token.accessToken
      └── Make session.accessToken available to components

Step 4: Session Persistence (types/next-auth.d.ts)
  ├── NextAuth Session extended with: accessToken
  └── User extended with: accessToken, refreshToken

Step 5: Component Access (via useSession())
  ├── useSession() returns { data: session, status }
  ├── session.accessToken available throughout app
  └── Passes to apiClient for all API requests

Step 6: Route Protection (middleware.ts)
  ├── Checks session for protected routes
  ├── If authenticated: allow access to /home, /goals, /console
  └── If not: redirect to /login

Step 7: Logout (sidebar logout button)
  └── signOut({ callbackUrl: "/" })
      ├── Clears NextAuth session
      └── Redirects to landing page
```

### 2. API Call Flow (High Level)

```
Component
  ↓
Custom Hook (useGoals, useChat, etc.)
  ↓
React Query (useQuery, useMutation)
  │
  └─→ API Function (goalsApi.decompose, etc.)
      │
      └─→ apiClient (lib/api/client.ts)
          │
          ├─→ Get session.accessToken from NextAuth
          ├─→ ADD Authorization header: Bearer {token}
          └─→ Construct fetch to /api/{endpoint}
              │
              └─→ Next.js API Route (app/api/[...path]/route.ts)
                  │
                  ├─→ Receive request
                  ├─→ Forward to Django backend
                  │   └─→ ${BACKEND_URL}/{endpoint}
                  │
                  ├─→ Get response from Django
                  └─→ Return to client
                      │
                      └─→ Back to apiClient (error handling)
                          │
                          ├─→ If 401 (unauthorized): call signOut()
                          └─→ Otherwise: return parsed response
                              │
                              └─→ React Query handles response
                                  │
                                  ├─→ useQuery/useMutation callbacks
                                  └─→ Component state updates
                                      │
                                      └─→ Component re-renders
```

### 3. Goal Decomposition Flow (Detailed)

```
User Interaction:

1. User types goal in home/page.tsx input
   └── Value stored in local state via promptField.tsx

2. User presses Enter or clicks Submit button
   └── Triggers handleSubmit() callback

3. handleSubmit() calls:
   mutation.mutate(goalText)
   └── useMutation hook from useGoals hook

4. Mutation calls goalsApi.decompose(text)
   └── Located in lib/api/goals.ts

5. goalsApi.decompose() function:
   ├── Calls apiClient("/decompose/", {
   │   method: "POST",
   │   body: JSON.stringify({ text: goalText })
   │ })
   └── Returns Promise<Goal[]>

6. apiClient function (lib/api/client.ts):
   ├── Gets session from useSession()
   ├── Extracts session.accessToken
   ├── Constructs headers:
   │   Authorization: Bearer {accessToken}
   ├── Makes fetch to /api/decompose/
   └── Returns parsed JSON

7. Next.js Proxy Route (app/api/[...path]/route.ts):
   ├── Receives POST /api/decompose/
   ├── Extracts pathname → /decompose/
   ├── Reconstructs request with headers
   ├── Forwards to Django: POST ${BACKEND_URL}/decompose/
   ├── Gets response from Django
   └── Returns response to client

8. Django Backend processes:
   ├── Validates user via Authorization header
   ├── Decomposes goal text into tasks
   ├── Creates Goal and Task objects
   └── Returns: { id, title, tasks: [...] }

9. Response back to client:
   ├── apiClient receives response
   ├── React Query useMutation catches data
   ├── onSuccess callback fires:
   │   ├── TODO: Show toast notification
   │   └── TODO: Redirect to /goals page
   └── Component state updates

10. UI Updates:
    ├── Loading spinner disappears
    ├── Input field clears
    ├── Success message or redirect
    └── User sees newly created goal
```

### 4. State Management Flow

```
React Query (Server State): lib/api/ + hooks/

    ┌─────────────────────────────────────────┐
    │  QueryClient (lib/QueryProvider.tsx)    │
    │  - staleTime: 60000 (60 seconds)        │
    │  - Caches all server data               │
    │  - DevTools available in dev            │
    └─────────────────────────────────────────┘
           ↓
    ┌─────────────────────────────────────────┐
    │  Query Hooks (hooks/)                   │
    │  - useGoals() → useQuery(['goals'], ...) │
    │  - useChat() → useMutation(...)          │
    └─────────────────────────────────────────┘
           ↓
    ┌─────────────────────────────────────────┐
    │  Components consume hooks                │
    │  - Automatically re-render on data      │
    │  - Handle loading/error states          │
    │  - Trigger mutations on user action     │
    └─────────────────────────────────────────┘


NextAuth (Auth State): types/ + components/providers/

    ┌─────────────────────────────────────────┐
    │  NextAuth Session                       │
    │  - JWT token storage                    │
    │  - User data persistence                │
    │  - Callback-based flow control          │
    └─────────────────────────────────────────┘
           ↓
    ┌─────────────────────────────────────────┐
    │  SessionProvider (NextAuthProvider)     │
    │  - Wraps entire app                     │
    │  - Makes session available via          │
    │    useSession() hook                    │
    └─────────────────────────────────────────┘
           ↓
    ┌─────────────────────────────────────────┐
    │  Components use useSession()            │
    │  - Check authentication status          │
    │  - Access user data and tokens          │
    │  - Trigger signIn/signOut               │
    └─────────────────────────────────────────┘


Local Component State: Component-level

    useState() in components for:
    - Form inputs
    - UI toggles (accordion open/close)
    - Modal visibility
    - Temporary UI state
```

---

## API Integration

### API Client Architecture

**File**: `lib/api/client.ts`

The core API function that all requests go through:

```typescript
apiClient<T>(
  endpoint: string,
  options?: RequestInit & { auth?: boolean }
): Promise<T>
```

**How it works:**

1. **Authentication**:
   - Calls `getSession()` from NextAuth
   - Extracts `session.accessToken`
   - Adds `Authorization: Bearer {token}` header

2. **Routing**:
   - All requests go to `/api/{endpoint}`
   - The proxy route catches and forwards to Django

3. **Error Handling**:
   - 401 response → calls `signOut()` to clear session
   - Other errors → parsed and thrown to caller

4. **URL Construction**:
   - Base URL is `/api` (relative to frontend)
   - Example: `apiClient("goals/list/")` → `/api/goals/list/`

### API Endpoints

#### Goals API (`lib/api/goals.ts`)

**Endpoint 1: Decompose Goal**

```
POST /decompose/
Input: { text: string }
Output: Goal[]

Example Flow:
  1. User enters: "Learn TypeScript and React"
  2. Frontend sends to /api/decompose/
  3. Django AI decomposes into tasks
  4. Returns array of Goal objects with tasks
```

**Endpoint 2: List Goals**

```
GET /list/
Input: (none - uses auth token)
Output: Goal[]

Example Flow:
  1. User navigates to /goals
  2. useGoals() hook calls goalsApi.list()
  3. Frontend sends to /api/list/
  4. Django returns all user goals with tasks
  5. Component renders with DataTable
```

**Endpoint 3: Delete Goal**

```
DELETE /{id}/
Input: goal ID in URL path
Output: (empty response on success)

Example Flow:
  1. User clicks delete button on goal tile
  2. Confirmation dialog appears
  3. User confirms deletion
  4. useDeleteGoal() hook calls goalsApi.delete(id)
  5. Frontend sends DELETE to /api/{id}/
  6. Django deletes goal and associated tasks
  7. Goals query invalidated, UI updates
```

#### Chat API (`lib/api/chat.ts`)

**Endpoint 1: Send Chat Message**

```
POST /conversations/chat/
Input: {
  content: string
  goal_id?: string (first message)
  conversation_id?: string (subsequent messages)
}
Output: {
  conversation_id: string
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    created_at: string
  }
}

Example Flow:
  1. User opens console for a goal
  2. useChat(goalId) hook initialized
  3. User types message and submits
  4. First message includes goal_id
  5. Django creates conversation and returns response
  6. conversation_id locked for future messages
  7. Subsequent messages use conversation_id
```

**Endpoint 2: Get Chat History**

```
GET /conversations/history/{goalId}/
Input: goal ID in URL path
Output: ChatMessage[]

Example Flow:
  1. User navigates to console/[id] page
  2. useQuery fetches chat history for goal
  3. Frontend sends GET to /api/conversations/history/{goalId}/
  4. Django returns all messages for that goal's conversation
  5. Messages displayed in chat interface
```

#### Auth Routes (`app/api/auth/[...nextauth]/route.ts`)

**Purpose**: Handle OAuth and session management

**Flow**:

1. User clicks "Continue with Google"
2. Redirects to Google OAuth
3. Google redirects back with auth code
4. `signIn` callback in NextAuth handler:
   - Exchanges code for Google user info
   - Calls Django bridge: `POST /users/auth/bridge/`
   - Django creates/updates user and returns JWT
   - JWT stored in NextAuth session
5. User authenticated, session available via `useSession()`

#### Proxy Route (`app/api/[...path]/route.ts`)

**Purpose**: Catch-all proxy to Django backend

**What it does**:

1. Receives all requests to `/api/*`
2. Excludes auth routes (returns 404)
3. Reconstructs request with:
   - Original method (GET, POST, etc.)
   - Original body
   - Authorization header
4. Forwards to Django at `${BACKEND_URL}/{path}`
5. Returns Django response to client

**Example**:

```
Frontend: POST /api/decompose/
          ↓
Proxy Route catches: /api/decompose/
          ↓
Forwards to: POST ${BACKEND_URL}/decompose/
          ↓
Django processes request
          ↓
Returns response
          ↓
Proxy returns to frontend
```

---

## Dependencies and Imports

### Import Chain: Goal Display & Deletion

```
goals/page.tsx (page)
  ├── imports useGoals from ../../hooks/useGoals
  │   └── hooks/useGoals.ts
  │       ├── imports useQuery from @tanstack/react-query
  │       ├── imports goalsApi from ../../lib/api/goals
  │       │   └── lib/api/goals.ts
  │       │       ├── imports apiClient from ./client
  │       │       └── exports decompose(), list(), delete()
  │       └── returns useQuery result
  │
  ├── imports useDeleteGoal from ../../hooks/useDeleteGoal
  │   └── hooks/useDeleteGoal.ts
  │       ├── imports useMutation from @tanstack/react-query
  │       ├── imports goalsApi from ../../lib/api/goals
  │       └── returns useMutation result with invalidation
  │
  ├── renders goalAccordion.tsx
  │   └── components/custom/goalAccordion.tsx
  │       ├── imports goalTile.tsx
  │       │   └── components/custom/goalTile.tsx
  │       │       ├── imports button from ../ui/button
  │       │       └── imports badge from ../ui/badge
  │       │
  │       └── imports datatable.tsx
  │           └── components/custom/datatable.tsx
  │               ├── imports useReactTable from @tanstack/react-table
  │               └── receives columnDef from taskColumns.tsx
  │                   └── goals/taskColumns.tsx
  │                       ├── imports statusIndicator
  │                       └── imports tableRowTitle
  │
  └── imports sectionHeader.tsx
      └── components/custom/sectionHeader.tsx
```

### Import Chain: AI Chat

```
console/[id]/page.tsx (page)
  ├── imports useChat from ../../hooks/useChat
  │   └── hooks/useChat.ts
  │       ├── imports sendChatMessage from ../../lib/api/chat
  │       │   └── lib/api/chat.ts
  │       │       ├── imports apiClient from ./client
  │       │       └── exports sendChatMessage(), getChatHistory()
  │       └── returns sendChatMessage mutation and state
  │
  ├── imports useQuery from @tanstack/react-query
  │   └── For fetching chat history
  │
  ├── renders promptField.tsx
  │   └── components/custom/promptField.tsx
  │       ├── imports button from ../ui/button
  │       └── imports input from ../ui/input
  │
  └── renders custom message UI
      ├── User messages (blue bubbles right)
      └── AI responses (gray bubbles left)
```

### External Library Usage

| Library                   | Usage                                                | Where                                                         |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| `next-auth`               | GoogleProvider, useSession, SessionProvider, signOut | app/api/auth/\*, components/providers/NextAuthProvider, pages |
| `@tanstack/react-query`   | useQuery, useMutation, QueryClient, DevTools         | hooks/\*, components/providers/QueryProvider                  |
| `@tanstack/react-table`   | useReactTable, ColumnDef                             | components/custom/datatable                                   |
| `@phosphor-icons`         | Icon components                                      | components (throughout)                                       |
| `tailwindcss`             | Utility classes for styling                          | components (throughout)                                       |
| `clsx` & `tailwind-merge` | Class name merging via cn()                          | lib/utils, components                                         |
| `next/navigation`         | useRouter, usePathname, useSearchParams              | pages and components                                          |
| `react`                   | useState, useEffect, useCallback, useMemo            | components throughout                                         |

### Type Definitions Flow

```
types/next-auth.d.ts
├── Extends NextAuth Session type
│   └── Adds: accessToken
│
├── Extends NextAuth User type
│   └── Adds: accessToken, refreshToken
│
└── Makes available to:
    ├── apiClient (lib/api/client.ts)
    ├── useSession hook
    └── All components using useSession()


lib/api/types.ts
├── Goal interface
│   ├── id: string
│   ├── title: string
│   ├── description: string
│   ├── due_date: string
│   └── tasks: Task[]
│
└── Task interface
    ├── id: string
    ├── title: string
    ├── description: string
    ├── is_completed: boolean
    └── due_date: string
```

---

## Key Interactions

### 1. Authentication Flow (Complete)

**Detailed Step-by-Step**:

1. **Landing Page Load** (`page.tsx`):

   ```
   - useSession() hook called
   - No session? → Show "Start Now" button
   - Session exists? → Redirect to /home
   ```

2. **User Clicks "Continue with Google"** (`login/page.tsx`):

   ```
   - signIn("google", { callbackUrl: "/home" })
   - Redirects to Google OAuth
   ```

3. **Google OAuth Callback** (handled by NextAuth):

   ```
   - Google returns auth code
   - NextAuth exchanges for Google user info
   ```

4. **NextAuth signIn Callback** (`app/api/auth/[...nextauth]/route.ts`):

   ```
   - Receives Google user: { email, name, ... }
   - Calls POST /api/auth/bridge ← Django bridge
   - Sends: { email, first_name, last_name }
   - Receives: { access: "JWT_TOKEN", refresh: "REFRESH_TOKEN" }
   - Returns user object with tokens attached
   ```

5. **NextAuth JWT Callback**:

   ```
   - Stores accessToken and refreshToken in JWT
   - These get encrypted and stored
   ```

6. **NextAuth Session Callback**:

   ```
   - Makes accessToken available in session
   - Passed to useSession() hook
   ```

7. **Redirect to /home**:

   ```
   - middleware.ts allows access
   - useSession() in useGoals confirms token exists
   - Can make authenticated API requests
   ```

8. **Logout** (sidebar logout button):
   ```
   - signOut({ callbackUrl: "/" })
   - Clears NextAuth session
   - Deletes JWT cookie
   - Redirects to landing page
   - Next visit to /home redirects to /login
   ```

### 2. Goal Creation & Decomposition

**Workflow**:

```
home/page.tsx
├── User sees:
│   ├── Example prompts (examplePrompt.tsx cards)
│   └── Text input (promptField.tsx textarea)
│
├── User Action 1: Click example prompt
│   └── onClick handler: setInputValue(prompt.text)
│       └── promptField shows filled text
│
├── User Action 2: Type custom text
│   └── promptField onChange: setInputValue(newText)
│
├── User Action 3: Press Enter or click Submit
│   └── handleSubmit() called:
│       ├── Validates input is not empty
│       ├── Calls mutation.mutate(inputValue)
│       └── useMutation from useGoals hook
│
└── Mutation Process:
    ├── goalsApi.decompose(text) called
    ├── apiClient("/decompose/", {
    │   method: "POST",
    │   body: JSON.stringify({ text })
    │ })
    ├── Authorization header added: Bearer {token}
    ├── Sent to /api/decompose/
    ├── Proxy forwards to Django /decompose/
    ├── Django AI decomposes goal
    ├── Returns { id, title, tasks: [...] }
    ├── React Query catches data
    ├── onSuccess callback:
    │   ├── TODO: Show toast notification
    │   ├── TODO: Redirect to /goals
    │   └── Form resets
    ├── UI updates:
    │   ├── Loading spinner appears/disappears
    │   └── Input field might clear
    └── User navigates to /goals to see created goal
```

### 3. Goals Viewing & Task Display

**Workflow**:

```
goals/page.tsx loads:
├── useGoals() hook triggered on mount
│   ├── useQuery(['goals'], goalsApi.list, ...)
│   └── Automatically fetches goals with cache
│
├── While loading:
│   └── Skeleton loading components displayed
│
├── On success (data received):
│   ├── goals.map(goal →
│   │   goalAccordion.tsx (key={goal.id})
│   │   ├── Header (always visible):
│   │   │   └── goalTile.tsx
│   │   │       ├── goal.title
│   │   │       ├── badge showing task count
│   │   │       ├── Delete button with confirmation dialog
│   │   │       └── "Open in Console" button
│   │   │
│   │   └── Body (collapsible OnClick):
│   │       └── datatable.tsx
│   │           ├── data: goal.tasks
│   │           ├── columns: imported from taskColumns.tsx
│   │           │   ├── Title column → tableRowTitle component
│   │           │   ├── Description column → text
│   │           │   ├── Due Date column → formatted date with days
│   │           │   └── Status column → statusIndicator component
│   │           ├── Features:
│   │           │   ├── Sortable columns (click header)
│   │           │   └── Selectable rows (checkbox)
│   │           └── Responsive to screen size
│   │
│   ├── Each task in table can be:
│   │   ├── Viewed
│   │   ├── Selected (checkbox)
│   │   └── Status checked via statusIndicator
│   │
│   └── User can:
│       ├── Expand/collapse each goal
│       ├── Sort tasks by any column
│       ├── Select multiple tasks
│       ├── Click "Open in Console" to chat about goal
│       └── Delete goals with confirmation
│
└── On error:
    └── Error message displayed
```

### 3.1 Goal Deletion Workflow

**Workflow**:

```
User clicks delete button on goalTile.tsx:
├── onClick handler prevents accordion toggle
├── Confirmation dialog: "Are you sure you want to delete [title]?"
├── User confirms deletion
├── useDeleteGoal() mutation triggered
│   ├── goalsApi.delete(id) called
│   ├── DELETE /api/{id}/ sent to backend
│   ├── Django deletes goal and associated tasks
│   └── Mutation returns success
├── React Query invalidates ['goals'] query
│   └── useGoals() refetches data automatically
├── UI updates with goal removed
└── Loading state shown during deletion
```

### 4. AI Chat Console

**Workflow**:

```
Console Navigation:
├── User navigates to /console
│   ├── console/page.tsx loads (root console page)
│   ├── useGoals() checks if user has goals
│   ├── If goals exist: redirect to /console/{firstGoalId}
│   └── If no goals: show empty state with "View Goal List" button
│
├── User navigates to /console/{goalId} (or redirected)
│   ├── console/[id]/page.tsx loads
│   ├── goalId extracted from URL params
│   ├── useQuery fetches chat history
│   │   ├── getChatHistory(goalId) called
│   │   ├── GET /api/conversations/history/{goalId}/
│   │   └── Returns existing conversation messages
│   │
├── Initial render:
│   ├── Message list displays chat history
│   ├── promptField ready for new messages
│   ├── Optimistic updates prepared
│   │
├── User types and submits message:
│   ├── handleSubmit() validates input
│   ├── Creates optimistic user message
│   ├── Adds to local message state immediately
│   ├── useChat() mutation sends message
│   │   ├── sendChatMessage() called
│   │   ├── POST /api/conversations/chat/
│   │   ├── First message: includes goal_id
│   │   ├── Subsequent: uses conversation_id
│   │   └── Django processes and returns AI response
│   │
├── Response handling:
│   ├── Mutation success callback
│   ├── Adds AI message to conversation
│   ├── conversation_id locked for future messages
│   ├── Optimistic messages filtered out
│   ├── UI updates with new messages
│   ├── Goals query invalidated (AI may modify tasks)
│   │
├── UI Features:
│   ├── User messages: blue bubbles (right)
│   ├── AI responses: gray bubbles (left)
│   ├── Auto-scroll to latest message
│   ├── Loading states during sending
│   ├── Error handling for failed messages
│   │
└── User can:
    ├── Send multiple messages in conversation
    ├── Refine goals through AI dialogue
    ├── Get guidance on task completion
    └── Conversation persists across sessions
```

### 5. Sidebar Navigation

**Workflow**:

```
Dashboard Layout (dashboard/layout.tsx):
├── sidebar.tsx component rendered
│   ├── Desktop mode:
│   │   ├── Fixed left sidebar
│   │   ├── Can collapse/expand (icons-only when collapsed)
│   │   └── Collapse state in local state
│   │
│   └── Mobile mode:
│       ├── Hidden by default
│       ├── Menu button opens as sheet (drawer)
│       └── Closes on route change
│
├── Navigation items (sidebarItem.tsx):
│   ├── Home item
│   │   ├── href="/home"
│   │   ├── usePathname() checks if active
│   │   └── Active: blue background, white text
│   │
│   ├── Goals item
│   │   ├── href="/goals"
│   │   ├── usePathname() checks if active
│   │   └── Active: blue background, white text
│   │
│   ├── Console item (not yet linked, placeholder)
│   │   └── href="/console"
│   │
│   ├── Objectives item
│   │   └── href="/objectives"
│   │
│   └── Logout button
│       └── onClick: signOut({ callbackUrl: "/" })
│
├── User clicks navigation item:
│   ├── useRouter().push(href)
│   ├── Next.js routes to new page
│   ├── Mobile sidebar auto-closes
│   └── usePathname() updates in sidebarItem
│       └── Active item highlights
│
└── Responsive behavior:
    ├── Desktop (>md): Fixed sidebar always visible
    ├── Tablet (sm-md): Collapsible sidebar
    └── Mobile (<sm): Hidden drawer sidebar
```

---

## Authentication System

### NextAuth Configuration

**File**: `app/api/auth/[...nextauth]/route.ts`

**Setup**:

- Google OAuth provider configured
- Session strategy: JWT (tokens in URL)
- Callbacks for sign-in, JWT, and session

**Key Callbacks**:

1. **signIn Callback**:

   ```typescript
   - Called after OAuth code exchange
   - Input: user data from Google
   - Action: Call Django bridge endpoint
   - Output: Attach Django tokens to user
   ```

2. **JWT Callback**:

   ```typescript
   - Called when encoding JWT
   - Input: token + user (if first time)
   - Action: Store accessToken, refreshToken
   - Output: Updated token
   ```

3. **Session Callback**:
   ```typescript
   - Called when creating session
   - Input: session + token
   - Action: Extract accessToken from token
   - Output: session.accessToken now available
   ```

### Session Type Extensions

**File**: `types/next-auth.d.ts`

```typescript
declare module "next-auth" {
  interface Session {
    accessToken: string; // Added field
  }

  interface User {
    accessToken: string;
    refreshToken: string; // Added fields
  }
}
```

### Using Session in Components

```typescript
// In any component:
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return <p>Not signed in</p>

  // session.accessToken available here ✓
  return <p>Welcome {session?.user?.email}</p>
}
```

### API Client Usage of Session

**File**: `lib/api/client.ts`

```typescript
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const session = await getSession(); // Get session server-side

  const headers: HeadersInit = {
    ...options?.headers,
    "Content-Type": "application/json",
  };

  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`; // Add token
  }

  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await signOut(); // Clear session on 401
  }

  return response.json();
}
```

---

## State Management

### React Query (Server State)

**Configuration**: `components/providers/QueryProvider.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // Data fresh for 60 seconds
      retry: 1, // Retry failed requests once
    },
  },
});
```

**Why React Query?**

- Caches server data automatically
- Deduplicates requests (same query within staleTime)
- Automatic refetching on window focus
- Background fetching without blocking UI
- Mutation handling with invalidation

**Example Usage** (`hooks/useGoals.ts`):

```typescript
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => goalsApi.list(),
    staleTime: 60000,
  });
}
```

**In Component** (`goals/page.tsx`):

```typescript
const { data: goals, isLoading, error } = useGoals()

if (isLoading) return <p>Loading...</p>
if (error) return <p>Error: {error.message}</p>
return goals.map(goal => <GoalCard key={goal.id} goal={goal} />)
```

### NextAuth (Auth State)

**How Session Persistence Works**:

1. **Initial Login**:
   - User credentials exchanged for JWT
   - JWT stored in encrypted HTTP-only cookie
   - Session persisted across page refreshes

2. **Page Refresh**:
   - NextAuth reads cookie
   - Session reconstructed from token
   - useSession() returns session data

3. **Logout**:
   - Cookie deleted
   - Session cleared
   - useSession() returns null

4. **Token Refresh** (if needed):
   ```typescript
   // Not yet implemented, but would go here:
   if (token.exp < Date.now()) {
     token = await refreshAccessToken(token);
   }
   ```

### Local Component State

**For UI-only State** (not synced with backend):

```typescript
// Form inputs
const [goalInput, setGoalInput] = useState("");

// UI toggles
const [isAccordionOpen, setIsAccordionOpen] = useState(false);

// Modal visibility
const [showDialog, setShowDialog] = useState(false);
```

**Pattern**: useState for temporary UI state, React Query for server data

---

## Summary

This architecture provides:

- **Security**: JWT-based auth with NextAuth integration and Django bridge
- **Scalability**: API proxy pattern for backend flexibility
- **Performance**: React Query caching, deduplication, and optimistic updates
- **User Experience**: Responsive design, smooth interactions, loading states
- **Maintainability**: Clear separation of concerns, typed throughout, modular components
- **Developer Experience**: TypeScript, composable components, organized structure

The system flows data from components → hooks → API client → Next.js proxy → Django backend, with state managed by React Query and NextAuth providing global session context.

**Current Features**:

- ✅ Google OAuth authentication
- ✅ Goal creation and AI decomposition
- ✅ Goal viewing with expandable task tables
- ✅ Goal deletion with confirmation
- ✅ AI chat console with conversation history
- ✅ Responsive design with mobile support
- ✅ Loading states and error handling
- ✅ Optimistic UI updates for chat

**Architecture Highlights**:

- Clean separation between data fetching (hooks) and UI (components)
- Centralized API client with automatic authentication
- Proxy pattern for seamless backend integration
- Optimistic updates for better user experience
- Query invalidation for data consistency
- Type-safe throughout with TypeScript
