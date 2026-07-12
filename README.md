# AssetFlow

**AssetFlow** is an enterprise-grade Asset Management (EAM) platform for tracking, allocating, and maintaining an organization's physical and digital assets — laptops, peripherals, fleet vehicles, meeting rooms, and more — from a single dashboard.

> Built as a two-part app: a React/TypeScript frontend (prototyped in Google AI Studio) and a Node/Express + MySQL backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Overview](#api-overview)
- [Branches](#branches)
- [Project Status](#project-status)

---

## Features

AssetFlow is organized into the following screens:

| Screen | Purpose |
|---|---|
| **Login** | User authentication |
| **Dashboard** | At-a-glance overview of asset counts, status breakdowns, and recent activity |
| **Asset Directory** | Browse, search, and manage the full inventory of tracked assets |
| **Asset Allocation** | Assign assets to employees/departments and track ownership history |
| **Resource Booking** | Reserve shared resources (meeting rooms, fleet vehicles, equipment) for specific time slots |
| **Notifications** | Maintenance approvals, booking requests, and other actionable alerts |
| **Activity Logs** | Audit trail of actions taken across the system |
| **Org Setup** | Configure departments, categories, and organizational structure |
| **Settings** | Application and account settings |

Each asset record tracks tag, name, category, department, status (`AVAILABLE` / `ALLOCATED` / `MAINTENANCE`), assigned owner, condition, location, purchase details, warranty, serial number, manufacturer, specs, and a full history log.

## Tech Stack

**Frontend** (`assetflow-frontend/`)
- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- [lucide-react](https://lucide.dev/) for icons
- [motion](https://motion.dev/) (Framer Motion) for animation
- Originally scaffolded via [Google AI Studio](https://ai.studio/)

**Backend** (`assetflow-backend/`)
- Node.js + Express
- MySQL (developed against [Aiven MySQL](https://aiven.io/mysql), via `mysql2`)
- `dotenv` for configuration, `cors` for cross-origin requests

## Project Structure

```
Odoo-AssetFlow/
├── assetflow-backend/
│   ├── src/
│   │   ├── app.js                  # Express app, route mounting, error handling
│   │   ├── server.js               # Server entrypoint
│   │   ├── config/db.js            # MySQL connection pool
│   │   ├── controllers/            # Route handlers (assets, bookings, notifications, ...)
│   │   └── routes/                 # Express routers per module
│   ├── schema.sql                  # Table definitions + seed data
│   └── .env.example
│
└── assetflow-frontend/
    ├── src/
    │   ├── App.tsx                 # Root component, routing/state
    │   ├── api.ts                  # API client
    │   ├── data.ts                 # Local/seed data
    │   ├── types.ts                # Shared TypeScript types
    │   └── components/             # One component per screen (see Features table)
    └── vite.config.ts
```

## Getting Started

### Backend Setup

```bash
cd assetflow-backend
npm install
cp .env.example .env
```

Edit `.env` with your MySQL connection details:

```env
PORT=5000
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_SSL=false
```

Create the schema and seed data:

```bash
mysql --host=<DB_HOST> --port=<DB_PORT> -u <DB_USER> -p --ssl-mode=REQUIRED <DB_NAME> < schema.sql
```

Run the server:

```bash
npm run dev      # http://localhost:5000
```

### Frontend Setup

```bash
cd assetflow-frontend
npm install
npm run dev       # http://localhost:3000
```

Build for production:

```bash
npm run build
```

## API Overview

Base URL: `http://localhost:5000/api`

| Endpoint | Status |
|---|---|
| `GET /health` | ✅ Live |
| `GET/POST /assets` | ✅ Live |
| `GET/POST /bookings` | ✅ Live |
| `GET/POST /notifications` | ✅ Live |
| `/auth`, `/departments`, `/categories`, `/employees`, `/allocations`, `/maintenance`, `/audits`, `/reports` | 🚧 Stubbed |

Stubbed routes return `501 Not Implemented` and are being built out incrementally.

## Branches

This repo has several active branches from parallel contributor work:

- `main` — baseline backend scaffolding (health check + stub routes for all modules)
- `protype-1` — prototype branch with the Dashboard fully wired to live `assets`, `bookings`, and `notifications` endpoints
- `frontend-manish`, `frontend-karmanya`, `frontend_k`, `rajas` — individual contributor branches

Because these branches diverged independently, file contents (e.g. `package.json`, presence of `server.js`/`config/db.js`) can differ between them — check the branch you're working from before assuming a file exists.

## Project Status

AssetFlow is an active work in progress. The frontend UI is fully built out across all screens; the backend is being connected module-by-module — asset, booking, and notification data are live against MySQL, while auth and the remaining modules are still stubbed pending implementation.

