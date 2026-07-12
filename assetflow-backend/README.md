# AssetFlow Backend

Node.js + Express backend for AssetFlow (Enterprise Asset & Resource Management System), deployed on Vercel, MySQL database.

## Structure

```
assetflow-backend/
├── api/
│   └── index.js          # Vercel serverless entry (exports the Express app)
├── src/
│   ├── app.js             # Express app, routes mounted here
│   ├── server.js          # Local dev entry (app.listen)
│   ├── config/
│   │   └── db.js          # MySQL connection pool
│   ├── routes/             # One file per module
│   ├── controllers/        # Business logic (empty for now)
│   └── middleware/         # Auth, validation, etc. (empty for now)
├── vercel.json
├── .env.example
└── package.json
```

Every feature module (`auth`, `departments`, `assets`, `bookings`, `maintenance`, `audits`, etc.) is
currently a stub in `src/app.js` returning `501 Not Implemented`. Build these out one at a time in
`src/routes/`, `src/controllers/`, and `src/config/db.js` for queries.

## Local development

```bash
npm install
cp .env.example .env   # fill in your MySQL credentials
npm run dev             # http://localhost:5000
```

Check it's alive:
- `GET /api/health` — server liveness (no DB needed)
- `GET /api/health/db` — verifies MySQL connection

## Deploying to Vercel

1. **Push this repo to GitHub** (Vercel deploys from a Git repo):
   ```bash
   git init
   git add .
   git commit -m "Initial AssetFlow backend skeleton"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to https://vercel.com/new
   - Import the GitHub repo
   - Framework preset: **Other**
   - Root directory: leave as the repo root (this project is already Vercel-ready via `vercel.json` + `api/index.js`)
   - Don't set a build command — there isn't one needed for a plain Express API

3. **Add environment variables** in the Vercel project settings (Settings → Environment Variables),
   matching `.env.example`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`

   Your MySQL database needs to be reachable from the internet (Vercel functions aren't on your
   local network). Options: PlanetScale, Railway, Aiven, or any managed MySQL with a public host.
   A local MySQL instance on your laptop won't work here.

4. **Deploy.** Vercel will give you a URL like `https://assetflow-backend.vercel.app`.
   Test it:
   - `https://your-app.vercel.app/api/health`
   - `https://your-app.vercel.app/api/health/db` (once DB env vars are set)

5. Give your frontend teammates the deployed base URL so they can point their API calls at it.

## Why this structure works on Vercel

Vercel runs each request as a serverless function — it doesn't keep a long-running process, so
`app.listen()` (used for local dev in `src/server.js`) is never called in production. Instead,
`api/index.js` exports the raw Express `app`, and `vercel.json` rewrites every incoming request to
that function. The MySQL connection uses a pool (`src/config/db.js`) with a small `connectionLimit`
so repeated cold starts don't exhaust your database's max connections.
