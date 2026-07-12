# AssetFlow

AssetFlow is an enterprise asset and resource management (EAM) platform built to help organizations track, allocate, and audit the physical and digital assets they own — laptops, fleet vehicles, machinery, peripherals, and shared resources like meeting rooms or equipment.

Instead of managing assets through spreadsheets, AssetFlow gives admins and staff a single dashboard to see what assets exist, who they're assigned to, what condition they're in, and when they were last serviced — plus tools to book shared resources and keep a full audit trail of every change.

---

## What it does

- **Command Dashboard** — a high-level overview of asset counts, utilization, and recent activity
- **Asset Directory** — a searchable, detailed record of every asset (serial numbers, purchase value, warranty, condition, assignment history)
- **Asset Allocation** — assign assets to employees and reclaim them when no longer needed
- **Resource Booking** — reserve shared resources for specific time slots, with conflict checking
- **Organization Setup** — manage departments and asset categories
- **Activity & Audit Logs** — a running history of who did what, when
- **Notifications** — alerts for bookings, maintenance, transfers, and returns
- **Settings** — manage user profile and platform preferences

---

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for the dev server and build tooling
- **Tailwind CSS v4** for styling
- **lucide-react** for icons

### Backend
- **Node.js** with **Express**
- **MySQL** (via `mysql2`) for persistent data storage
- REST API architecture, organized into modular route handlers per feature (assets, departments, employees, bookings, maintenance, audits, etc.)

### Tooling
- Git & GitHub for version control
- Vercel-ready backend deployment config

---

## Project Structure

Odoo-AssetFlow/
├── assetflow-frontend/       # React + Vite client
│   └── src/
│       ├── components/       # Screen-level components (Dashboard, Directory, Allocation, Booking, etc.)
│       ├── data.ts            # Seed/demo data
│       ├── types.ts           # Shared TypeScript types
│       └── App.tsx            # Root component & state management
│
└── assetflow-backend/        # Express API
└── src/
├── routes/            # Feature-based route modules
├── config/db.js        # MySQL connection pool
└── app.js              # Express app setup



Visit https://odoo-asset-flow-zx6t.vercel.app/

---

## License

Apache-2.0
