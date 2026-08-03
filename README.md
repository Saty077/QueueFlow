# QueueFlow — Task Automation & Job Processing Platform

A full-stack task management platform with async job processing, built as a
technical assessment for Saarthi AI. Users can register, create tasks, and
have them processed asynchronously through a Redis-backed queue, with live
status tracking (Pending → Processing → Completed/Failed).

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, Redux Toolkit, TanStack Query, Axios
**Backend:** Node.js, Express, TypeScript
**Database:** MongoDB (Mongoose)
**Queue / Cache:** Redis + BullMQ
**Auth:** JWT (access + refresh tokens), Role-Based Access Control (Admin/User)
**DevOps:** Docker, docker-compose

## Architecture

\`\`\`mermaid
graph LR
A[Next.js Frontend] -->|REST API| B[Express Backend]
B --> C[(MongoDB)]
B --> D[(Redis)]
B -->|enqueue job| E[BullMQ Queue]
E -->|processed by| F[BullMQ Worker]
F --> D
F --> C
\`\`\`

The BullMQ worker runs inside the same backend process as the API server
(imported as a side effect in `server.ts`) — not a separate service. When a
task is created, it's pushed onto a Redis-backed queue and processed
asynchronously; the worker updates the task's status in MongoDB as it moves
through Pending → Processing → Completed/Failed.

## Folder Structure

QueueFlow/
├── backend/
│ ├── src/
│ │ ├── config/ # DB + Redis connection setup
│ │ ├── controllers/ # Route handlers
│ │ ├── middlewares/ # Auth, error handling, rate limiting
│ │ ├── models/ # Mongoose schemas
│ │ ├── queues/ # BullMQ queue + worker
│ │ ├── routes/ # Express routers
│ │ ├── types/ # Shared TS types
│ │ └── server.ts
│ ├── Dockerfile
│ └── docs/
│ └── QueueFlow.postman_collection.json
├── frontend/
│ ├── src/
│ │ ├── app/ # Next.js App Router pages
│ │ ├── components/
│ │ ├── lib/ # Axios instance, API helpers
│ │ ├── providers/ # React Query / Redux providers
│ │ ├── store/ # Redux Toolkit slices
│ │ └── types/
│ └── Dockerfile
└── docker-compose.yml

## Installation

### Option A — Docker (recommended, no local Mongo/Redis needed)

\`\`\`powershell
git clone [<https://github.com/Saty077/QueueFlow>](https://github.com/Saty077/QueueFlow)
cd QueueFlow
docker-compose up --build
\`\`\`
Frontend: http://localhost:3000
Backend health check: http://localhost:5000/api/health

### Option B — Local (without Docker)

Requires local MongoDB and Redis running.

\`\`\`powershell
cd backend
npm install
copy .env.example .env # fill in real values
npm run dev

cd frontend
npm install
copy .env.example .env.local # fill in real values
npm run dev
\`\`\`

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Backend needs Mongo connection string, JWT secrets, Redis URL. Frontend needs
the API base URL.

## API Documentation

Full request/response reference: `backend/docs/QueueFlow.postman_collection.json`
— import into Postman or Thunder Client.

Core endpoints:

- `POST /api/auth/register`, `/login`, `/refresh`, `/logout`
- `GET/POST/PUT/DELETE /api/tasks` (owner-scoped, JWT protected)
- `GET /api/health`

## Assumptions Made

- MongoDB and Redis are containerized locally via docker-compose rather than
  requiring reviewers to provide cloud credentials (e.g. MongoDB Atlas) to run
  the project.
- Rate limiting and RBAC are applied at the middleware level rather than
  per-route, since the scope is a single Task resource.

## Trade-offs

- No automated tests (Jest) — prioritized core functional requirements given
  the assessment timeline; flagged as a known gap.
- No CI/CD pipeline — explicitly listed as bonus scope in the assessment.
- No WebSocket/real-time updates — explicitly listed as bonus scope; status
  updates are fetched via polling/refetch instead.

## Future Improvements

- Real-time task status updates via Socket.IO
- Search, pagination, filtering, and sorting on the task list
- Automated test coverage (Jest + Supertest)
- CI pipeline via GitHub Actions
