## Goal Tracker v1

Full-stack web app (React + Node.js + PostgreSQL) for setting and tracking long-term goals with five-year vision prompts, one-year goals with strategies and action steps, milestones, optional letter to the future, and quarterly summaries/reflections.

### Tech Stack

- Backend: Node.js, TypeScript, Express, Prisma (PostgreSQL)
- Frontend: React, TypeScript, Vite
- DB: PostgreSQL (via Docker Compose)

### Quick Start

1. Prerequisites: Node 18+, Docker Desktop

2. Start PostgreSQL:

```
docker compose up -d
```

3. Install deps and set up env:

```
cd "server"
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
cd ../client
npm install
```

4. Run dev servers (two terminals):

```
cd "server" && npm run dev
```

```
cd "client" && npm run dev
```

Backend runs at `http://localhost:4000` and frontend at `http://localhost:5173` by default.

### Environment

Backend `.env` (see `.env.example`):

```
DATABASE_URL=postgresql://goaltracker:goaltracker@localhost:5432/goaltracker
JWT_SECRET=replace-with-a-strong-secret
PORT=4000
```

### Project Structure

```
Goal Tracker v1/
  ├── docker-compose.yml
  ├── server/
  │   ├── src/
  │   ├── prisma/
  │   ├── package.json
  │   └── tsconfig.json
  └── client/
      ├── src/
      ├── package.json
      └── tsconfig.json
```

### Notes

- First-run will create DB tables via Prisma migrations.
- The server includes a background scheduler stub for delivering “letter to the future” (console log placeholder). Replace with an email provider to send real emails.



# Goal-Tracker-V1
