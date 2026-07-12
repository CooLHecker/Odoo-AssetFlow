# AssetFlow

AssetFlow is an enterprise asset and resource management (EAM) platform for tracking, allocating, and auditing organizational assets — laptops, fleet vehicles, machinery, and other equipment — across departments.

Admins and staff can browse the asset directory, allocate equipment to employees, book shared resources, review activity/audit logs, and manage the org structure, all from a single dashboard.

---

## Features

- **Email verification login** — passwordless sign-in via a 6-digit one-time code sent to your work email
- **Asset directory** with detailed records (serials, warranty, purchase value, condition, history)
- **Asset allocation matrix** for assigning/reclaiming equipment
- **Resource booking system** for shared resources (rooms, vehicles, equipment)
- **Organization setup** — departments and asset categories
- **Activity & audit logs**
- **Notification center**
- **Light / dark mode** toggle
- Responsive, modern UI

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react icons

### Backend
- Node.js + Express
- MySQL (`mysql2`)
- Nodemailer (email delivery)
- JWT (`jsonwebtoken`) for session tokens

---

## Project Structure

Odoo-AssetFlow/
├── assetflow-frontend/       # React + Vite client
│   └── src/
│       ├── components/       # Screens (Login, Dashboard, Directory, etc.)
│       ├── lib/authApi.ts     # Client for the backend's auth endpoints
│       └── App.tsx
│
└── assetflow-backend/        # Express API
└── src/
├── routes/
│   └── auth.routes.js  # Email OTP request/verify + JWT issuance
├── utils/mailer.js      # Nodemailer wrapper
└── config/db.js         # MySQL pool

---

## Getting Started

### 1. Backend setup

```bash
cd assetflow-backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL` | MySQL connection |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | SMTP credentials used to email login codes |
| `OTP_EXPIRY_MINUTES` | How long a login code stays valid (default `10`) |
| `JWT_SECRET` | Long random string used to sign session tokens |

> **No SMTP configured?** The app still works — the verification code is printed to the backend console instead of emailed, so you can develop locally without real credentials. Any standard SMTP provider works (Gmail w/ App Password, SendGrid, Mailgun, SES, Postmark, Outlook, etc.).

Run it:

```bash
npm run dev     # nodemon, auto-restarts
# or
npm start
```

### 2. Frontend setup

```bash
cd assetflow-frontend
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to point at the backend (default `http://localhost:5000/api`).

```bash
npm run dev
```
