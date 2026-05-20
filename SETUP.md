# Finance Data Processing - Full-Stack Setup

This is a monorepo containing both the backend and frontend for the Finance Data Processing application.

## Project Structure

```
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, rate limiting, etc.
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities and prisma client
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/   # Migration files
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   ├── package.json
│   └── .env              # Backend environment variables
│
├── frontend/             # React frontend app
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── controllers/  # API integration layer
│   │   ├── models/       # Data models
│   │   ├── services/     # Auth and API services
│   │   └── utils/        # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   └── .env              # Frontend environment variables
│
└── package.json          # Root workspace configuration
```

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs on **http://localhost:3000** by default.

#### Backend Environment Variables (.env)
```
JWT_SECRET=dev-secret-key
DATABASE_URL="file:./prisma/dev.db"
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** by default and connects to the backend at `http://localhost:3000`.

#### Frontend Environment Variables (.env)
```
VITE_API_URL=http://localhost:3000
```

## Available Commands

### From Root

```bash
npm run backend:start     # Start the backend server
npm run backend:test      # Run backend tests
npm run frontend:dev      # Start frontend dev server
npm run frontend:build    # Build frontend for production
```

### Backend Commands (from `backend/` folder)

```bash
npm start                 # Start the server
npm test                  # Run tests
npm run prisma:generate   # Regenerate Prisma client
npm run prisma:migrate    # Run database migrations
```

### Frontend Commands (from `frontend/` folder)

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## API Documentation

The backend provides Swagger UI documentation at:
- **Local:** http://localhost:3000/api-docs
- **Production:** https://finance-data-processing-access-control-lxp4.onrender.com/api-docs

## Features

### Authentication (RBAC)
- User registration with role selection (ADMIN, ANALYST, VIEWER)
- JWT-based login
- Role-based access control on all protected routes

### Records Management
- Create, read, update, delete financial records (ADMIN only)
- Search and pagination support
- Income and expense categorization

### Dashboard
- Financial summary (income, expense, net balance)
- Recent transactions
- Category totals and breakdowns
- Monthly, quarterly, and yearly analytics

### Budget Management
- Create budgets by category (ADMIN only)
- Compare spending against budgets
- Exceed alerts

## Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests use Jest and Supertest to validate:
- Auth endpoints
- RBAC enforcement
- Record CRUD operations

## Troubleshooting

### Backend won't start: `PrismaClientInitializationError`

This usually means Prisma needs to be regenerated after moving the project:

```bash
cd backend
npx prisma generate
npm start
```

### Frontend can't connect to backend

Ensure:
1. Backend is running on `http://localhost:3000`
2. Frontend's `.env` has `VITE_API_URL=http://localhost:3000`
3. Restart the frontend dev server after changing `.env`

### Permission denied on `prisma` command

Fix by running:

```bash
cd backend
chmod +x node_modules/.bin/prisma
npm install
```

## Notes

- Both backend and frontend are completely independent and can be deployed separately
- The backend uses SQLite for development (configured in `DATABASE_URL`)
- JWT tokens expire after 1 day
- The frontend stores JWT tokens in `localStorage` for persistence

## Deployment

### Backend
Can be deployed to services like Heroku, Render, AWS, etc. Requires setting:
- `JWT_SECRET` environment variable
- `DATABASE_URL` (for production database)

### Frontend
Can be deployed to Vercel, Netlify, GitHub Pages, or any static hosting. Requires setting:
- `VITE_API_URL` to the production backend URL

---

For more details, see `API_Documentation.md` for the complete API reference.
