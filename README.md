# Goal Tracker

A full-stack web application that helps users turn long-term vision into clear, actionable goals through a structured and practical workflow.

## Executive Summary

Goal Tracker is a full-stack web application designed to help users bridge the gap between long-term aspirations and daily actions. Instead of focusing on short-term task lists, the application guides users through a structured flow — from defining a five-year vision to breaking it down into goals, strategies, and concrete action steps — with an emphasis on clarity, consistency, and real-world usability.

## Project Overview

Goal Tracker was built to solve a simple but common problem: long-term goals often feel disconnected from everyday progress. The application encourages users to start with reflection and direction, then gradually move toward execution. By breaking abstract ideas into smaller, trackable actions, users can better understand how daily effort contributes to long-term growth.

## Product Principles

- **Vision to Action**: Help users clearly connect long-term vision with short-term execution.
- **Progress Over Perfection**: Encourage steady progress through manageable goals instead of overwhelming plans.
- **Flexible Usage**: Support both authenticated users with persistent storage and unauthenticated users with localStorage.
- **Focus-Oriented Design**: Limit active goals to promote completion and reduce scattered effort.

## Key Features

### Five-Year Vision Flow

- It guides users through 11 prompts to reflect on learning, growth, and aspirations.
- It supports both authenticated users (data stored in a database) and unauthenticated users (data stored in `localStorage`).
- It allows for seamless migration of user data from `localStorage` to the database upon registration.

### Goal & Strategy Management

- Users can create goals with a clear purpose ("why") and an expected completion date.
- Goals can be broken down into strategies and actionable steps.
- Progress can be tracked with simple status updates.
- The system provides automatic tracking of start and completion dates.

### Dashboard

- Offers a centralized view of goals, strategies, and actions.
- Allows progress updates at any level of the hierarchical structure.
- Includes visual indicators and lightweight feedback on completion status.
- Displays the user's long-term vision alongside their current goals.

## Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- Git

### Setup

**1. Start the database:**

```bash
docker compose up -d
```

**2. Backend:**

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://goaltracker:goaltracker@localhost:5433/goaltracker
JWT_SECRET=your-secret-key
PORT=4000
```

Run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

**3. Frontend:**

```bash
cd ../client
npm install
npm run dev
```

**4. Open the app:**

```
http://localhost:5173
```

## Tech Stack

- **Frontend:**
  - React 18 + TypeScript
  - Vite
  - React Router
  - Axios
- **Backend:**
  - Node.js + Express
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - JWT authentication
- **Infrastructure:**
  - Docker Compose
  - Prisma Migrations

## Future Improvements

- Reflection features (quarterly summaries, future letters)
- Progress analytics and visual insights
- Data export
- Mobile-first responsive design
- Email integration and account recovery

## Architecture (Optional)

<details>
<summary>System Overview</summary>

- Separate client and server for clear separation of concerns
- RESTful API design
- Relational data model for goals, strategies, and actions
- Stateless authentication using JWT

This structure allows the application to scale while remaining easy to reason about and maintain.

</details>

## Author

Built as a personal full-stack project to explore product-oriented system design and practical goal management workflows.
