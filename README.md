# Goal Tracker

A full-stack web application for setting and tracking long-term personal goals through a structured hierarchy: Five-Year Vision → Annual Goals → Strategies → Action Steps. Built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Executive Summary

Goal Tracker is a production-ready full-stack application that helps users transform long-term aspirations into actionable, trackable goals. The system implements a hierarchical goal breakdown (Vision → Goals → Strategies → Actions) with JWT authentication, PostgreSQL persistence, and a React TypeScript frontend. The application supports both authenticated users with database storage and unauthenticated users with localStorage, enabling progressive onboarding. Core technologies include React 18, Express, Prisma ORM, and Docker Compose for local development.

## Project Overview

Goal Tracker addresses a common problem in personal productivity: the disconnect between high-level aspirations and daily actions. Traditional goal-setting tools often lack structure, making it difficult to see how immediate tasks contribute to long-term outcomes.

The application provides a clear hierarchical framework that bridges this gap. Users begin by defining a five-year vision through guided prompts, then break it down into annual goals, each supported by strategies and concrete action steps. Every level of the hierarchy can be independently tracked with status updates, milestones, and completion tracking.

### Design Intent

- **Hierarchical Goal Breakdown**: Transform abstract five-year visions into concrete, actionable steps
- **Progress Tracking**: Enable independent status tracking at every level (goals, strategies, actions)
- **Flexible Workflow**: Support both authenticated users (persistent storage) and unauthenticated users (localStorage)
- **Focus Management**: Limit active goals to encourage completion before starting new ones

## Core Features (V1)

### User Authentication
- Secure user registration and login with JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes with authentication middleware
- Token-based session management

### Five-Year Vision Wizard
- Guided questionnaire with 11 prompts covering learning, growth, experiences, and aspirations
- Data persistence to database (authenticated) or localStorage (unauthenticated)
- Seamless migration from localStorage to database upon registration

### Goal Management
- **Goal Creation**: Create goals with title, optional "why" statement, and expected completion date
- **Active Goal Limit**: System enforces a limit on active goals to promote focus and completion
- **Status Tracking**: Track progress with status updates (UNBEGUN, IN_PROGRESS, PAUSED, COMPLETE)
- **Strategy Breakdown**: Break goals into multiple strategies, each with actionable steps
- **Automatic Date Tracking**: System records start dates when goals become active and completion dates when finished
- **Milestones**: Add custom milestone notes with timestamp tracking

### Dashboard
- Comprehensive view of all goals with nested strategies and action steps
- Update status at any hierarchy level (goal, strategy, or action)
- Visual status indicators and celebration animations on completion
- Display vision summary alongside goals
- Support for both authenticated and unauthenticated user workflows

### Data Persistence
- **Authenticated Users**: All data stored in PostgreSQL with full relational integrity
- **Unauthenticated Users**: Data stored in browser localStorage with seamless migration to account upon registration

## Tech Stack

### Frontend
- **React 18.3** with TypeScript
- **React Router 6** for client-side routing
- **Vite** for build tooling and development server
- **Axios** for HTTP client with JWT token interceptors
- **CSS3** for styling (no external UI libraries)

### Backend
- **Node.js** with **Express 4.19**
- **TypeScript** for type safety
- **Prisma 5.16** as ORM
- **PostgreSQL 16** as relational database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for runtime schema validation
- **Helmet** for security headers
- **CORS** for cross-origin resource sharing

### Infrastructure
- **Docker Compose** for local PostgreSQL database
- **Prisma Migrations** for database schema management

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL container)
- Git

### Setup Steps

1. **Start Database**
   ```bash
   docker compose up -d
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file:
   ```env
   DATABASE_URL=postgresql://goaltracker:goaltracker@localhost:5433/goaltracker
   JWT_SECRET=your-secret-key-change-in-production
   PORT=4000
   ```
   
   Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **Run Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server && npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client && npm run dev
   ```

5. **Access Application**
   
   Open `http://localhost:5173` in your browser.

## Design Decisions

### Why a Hierarchical Structure?

The Vision → Goal → Strategy → Action hierarchy provides clear traceability from high-level aspirations to daily tasks. This structure helps users understand how their immediate actions contribute to long-term outcomes, addressing the common problem of disconnected goal-setting.

### Why Limit Active Goals?

Research suggests that focusing on fewer goals increases completion rates. The active goal limit encourages users to complete existing goals before starting new ones, promoting focus and achievement rather than scattered effort.

### Why Support Unauthenticated Users?

Lowering the barrier to entry allows users to experience the value of the application before committing to registration. Data migration from localStorage to database upon registration provides a smooth onboarding experience without losing user progress.

### Why Prisma?

Prisma provides type-safe database access, automatic migration generation, and excellent TypeScript integration. The schema-first approach ensures database changes are version-controlled and reproducible, reducing the risk of schema drift in production.

### Why JWT for Authentication?

JWT tokens enable stateless authentication, simplifying horizontal scaling and reducing server-side session storage requirements. The 7-day expiration balances security with user convenience, reducing frequent re-authentication while maintaining reasonable security boundaries.

### Why Separate Client and Server?

Monorepo structure with separate client and server directories provides clear separation of concerns, independent deployment capabilities, and easier maintenance. Each can be developed, tested, and deployed independently, which is essential for production applications.

## Known Limitations (V1)

1. **Future Letters**: Backend API exists but no frontend UI implemented
2. **Quarterly Summaries**: Backend API exists but no frontend UI implemented
3. **Email Delivery**: Future letter delivery is stubbed (console logs only)
4. **No Password Reset**: Password recovery functionality not implemented
5. **No Email Verification**: Account email verification not implemented
6. **No Social Authentication**: Only email/password authentication available
7. **No Mobile App**: Web-only application (responsive design not fully optimized)
8. **No Data Export**: Users cannot export their goals and vision data
9. **No Collaboration**: Goals are strictly personal (no sharing or team features)
10. **No Analytics**: No progress analytics or visualization beyond status tracking

## Future Improvements (V2)

### High Priority
- **Frontend for Future Letters**: Complete the letter-to-future feature with UI
- **Quarterly Summary UI**: Implement quarterly reflection interface
- **Email Integration**: Integrate email service (SendGrid, AWS SES) for letter delivery
- **Password Reset Flow**: Implement secure password recovery
- **Data Export**: Allow users to export goals as JSON or PDF
- **Progress Analytics**: Charts and graphs showing goal completion trends
- **Mobile Optimization**: Fully responsive design for mobile devices

### Additional Enhancements
- **User Experience**: Goal templates, reminders & notifications, search & filter capabilities
- **Collaboration**: Goal sharing, comments & notes, file attachments
- **Platform**: Social authentication (OAuth), dark mode, internationalization
- **Engineering**: Comprehensive test coverage, CI/CD pipeline, API documentation (OpenAPI/Swagger), full application Dockerization

## Architecture

### Project Structure

```
Goal-Tracker-V1/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── lib/            # API client and utilities
│   │   ├── App.tsx         # Main router component
│   │   └── main.tsx       # Application entry point
│   └── package.json
│
├── server/                 # Express backend application
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   └── index.ts        # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema definition
│   │   └── migrations/     # Database migration files
│   └── package.json
│
├── docker-compose.yml      # PostgreSQL container configuration
└── README.md
```

### Frontend Architecture

- **Component-Based**: React functional components with hooks
- **Client-Side Routing**: React Router for navigation
- **State Management**: React useState and useEffect hooks
- **API Communication**: Centralized Axios instance with request interceptors
- **Type Safety**: Full TypeScript coverage for components and API responses
- **Progressive Enhancement**: Works for unauthenticated users with localStorage fallback

### Database Schema

The application uses a normalized relational schema with the following key models:

- **User**: Authentication and user profile data
- **Vision**: Five-year vision responses (11 optional fields)
- **Goal**: Annual goals with title, why, dates, and status
- **Strategy**: Goal breakdown strategies
- **ActionStep**: Concrete action items
- **Milestone**: Achievement markers for goals
- **FutureLetter**: Letters to be delivered at future dates (backend support)
- **QuarterlySummary**: Quarterly reflection entries (backend support)

All models include proper foreign key relationships, timestamps, and status enums (UNBEGUN, IN_PROGRESS, PAUSED, COMPLETE).

### API Design

RESTful API with the following endpoints (V1 implementation):

**Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

**Vision**
- `POST /vision` - Create vision (protected)
- `GET /vision/latest` - Get user's latest vision (protected)

**Goals**
- `POST /goals` - Create goal (protected, enforces active goal limit)
- `GET /goals` - List user's goals (protected)
- `PATCH /goals/:goalId/status` - Update goal status (protected)
- `PATCH /goals/:goalId/milestones` - Add milestone (protected)

**Strategies & Actions**
- `PATCH /goals/strategies/:strategyId/status` - Update strategy status (protected)
- `PATCH /goals/actions/:actionId/status` - Update action status (protected)

All protected routes require JWT Bearer token in Authorization header.

## Author

Built as a personal full-stack project to demonstrate proficiency in modern web development technologies and software engineering practices.

---

**Note**: This is a production-ready application structure suitable for deployment. For production deployment, ensure:
- Strong `JWT_SECRET` environment variable
- Secure database credentials
- HTTPS enabled
- Environment-specific configuration
- Error logging and monitoring
- Database backups
