# AssetFlow

AssetFlow is a smart asset management and booking platform designed to help organizations efficiently manage shared resources such as meeting rooms, laptops, projectors, vehicles, and other equipment.

Users can view available assets, reserve them for specific time slots, and track bookings, while administrators can manage inventory, approve requests, and monitor asset utilization.

---

## Features

- Secure user authentication
- Browse available assets
- Time-slot based asset booking
- Overlap validation to prevent double bookings
- Booking history
- Asset availability dashboard
- Admin panel for asset management
- User role management
- Responsive and modern UI

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS / Tailwind CSS (if used)

### Backend
- Node.js
- Express.js
- PostgreSQL / MongoDB (choose whichever you're using)
- Prisma / Mongoose (if applicable)

### Other Tools
- Git & GitHub
- REST APIs

---

## Project Structure

```
AssetFlow/
│
├── assetflow-backend/
│
├── src/
│
├── public/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Navigate to the project

```bash
cd AssetFlow
```

### Install frontend dependencies

```bash
npm install
```

### Run the frontend

```bash
npm run dev
```

### Backend

```bash
cd assetflow-backend
npm install
npm start
```

---

## Workflow

Create your own feature branch before making changes.

```bash
git switch -c feature-name
```

Commit changes.

```bash
git add .
git commit -m "Describe your changes"
```

Push your branch.

```bash
git push -u origin feature-name
```

Create a Pull Request on GitHub for review.

---

## Future Enhancements

- QR Code based asset check-in/check-out
- Email notifications
- Calendar integration
- Analytics dashboard
- Mobile application
- AI-powered asset demand prediction

---

## Contributors

- Karmanya Jakhotia
- Team Members

---

## License

This project was developed for the **Odoo Hackathon 2026**.
