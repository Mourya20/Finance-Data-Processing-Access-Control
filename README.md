# Finance Data Processing & Access Control

A full-stack financial dashboard with a secure, high-performance backend and a React frontend. The system manages financial records and delivers advanced analytics through a Role-Based Access Control (RBAC) architecture — demonstrating clean monorepo structure, secure data processing, and meaningful financial insights beyond basic CRUD.

---

## Live Application

| Service | URL |
|---|---|
| API Base URL | https://finance-data-processing-access-control-lxp4.onrender.com |
| Swagger API Docs | https://finance-data-processing-access-control-lxp4.onrender.com/api-docs |

---

## Technology Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** SQLite
- **ORM:** Prisma (with raw SQL for analytics)
- **Auth:** JWT (JSON Web Tokens) + bcrypt
- **API Docs:** Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Rate Limiting:** express-rate-limit
- **Testing:** Jest + Supertest
- **Deployment:** Render (Linux, debian-openssl-3.0.x)

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **Architecture:** MVC-inspired (controllers, services, models, pages)

---

## Project Structure

```
Finance-Data-Processing-Access-Control/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request/response logic
│   │   │   ├── auth.controller.js
│   │   │   ├── budget.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── record.controller.js
│   │   │   └── users.controller.js
│   │   ├── middleware/         # Auth, RBAC, rate limiting
│   │   │   ├── auth.middleware.js
│   │   │   ├── rateLimit.js
│   │   │   └── role.middleware.js
│   │   ├── routes/             # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── budget.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── record.routes.js
│   │   │   └── users.routes.js
│   │   ├── services/           # Business logic (Prisma + raw SQL)
│   │   │   ├── dashboard.service.js
│   │   │   └── record.service.js
│   │   └── utils/              # Prisma client, JWT helpers
│   │       ├── generateToken.js
│   │       └── prisma.js
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.cjs            # Database seeder
│   │   └── migrations/         # Version-controlled migrations
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── basic.test.js
│   ├── app.js                  # Express app + Swagger config
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .env                    # Local env variables (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Route-level page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── RecordsPage.jsx
│   │   │   ├── BudgetPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── components/         # Reusable UI components
│   │   │   └── Navbar.jsx
│   │   ├── controllers/        # API integration layer
│   │   │   ├── auth.controller.js
│   │   │   ├── budget.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── record.controller.js
│   │   ├── models/             # Data shape definitions
│   │   │   ├── budget.model.js
│   │   │   ├── record.model.js
│   │   │   └── user.model.js
│   │   ├── services/           # Auth and API services
│   │   │   ├── api.service.js
│   │   │   └── auth.service.js
│   │   └── utils/
│   │       └── authUtils.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── package.json                # Root workspace config (npm workspaces)
├── SETUP.md                    # Detailed setup and deployment guide
├── API_Documentation.md        # Full API reference
├── RESTRUCTURING_SUMMARY.md    # Monorepo migration notes
└── .gitignore
```

---

## Core Features

### Authentication & Authorization
- JWT-based secure authentication
- bcrypt password hashing
- Role-Based Access Control (RBAC) via middleware
- Rate limiting on all API routes

### Financial Record Management
- Full CRUD for financial records (Admin only for write operations)
- Each record: Amount, Type (Income/Expense), Category, Date, Notes
- Pagination, filtering, search, and soft delete support

### Financial Analytics
- **Summary:** Total income, total expenses, net balance
- **Time-based:** Monthly, quarterly, yearly breakdowns
- **Advanced:** EBITDA, PAT (Profit After Tax, tax fixed at 10%), category-wise expense breakdown

### Budget Tracking
- Define per-category budgets
- Compare actuals vs limits
- Over-budget alerts

### Frontend Dashboard
- Login / Register pages with role selection
- Dashboard with summary stats and recent transactions
- Records management page
- Budget page with category spend tracking
- Users page (Admin only)
- React Router v6 SPA navigation

### Role-Based Access Control
| Role | Permissions |
|---|---|
| **Admin** | Full access — manage users, CRUD records, set budgets |
| **Analyst** | View records and analytics |
| **Viewer** | Dashboard-only access |

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` (or copy from `.env.example`):

```env
JWT_SECRET=your_secret_key
DATABASE_URL="file:./prisma/prisma/dev.db"
```

Run migrations and start:

```bash
npx prisma migrate dev
npm start
# → http://localhost:3000
# → Swagger: http://localhost:3000/api-docs
```

Seed sample data (optional):

```bash
npm run seed
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
# → http://localhost:5173
```

### Both (from root using workspaces)

```bash
# Terminal 1
npm run backend:start

# Terminal 2
npm run frontend:dev
```

### Root workspace commands

```bash
npm run backend:start      # Start backend server
npm run backend:test       # Run backend tests
npm run frontend:dev       # Start frontend dev server
npm run frontend:build     # Build frontend for production
```

---

## API Overview

### Authentication
| Method | Route | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Records
| Method | Route | Access |
|---|---|---|
| GET | `/records` | Admin, Analyst |
| POST | `/records` | Admin |
| PUT | `/records/:id` | Admin |
| DELETE | `/records/:id` | Admin |

### Dashboard & Analytics
| Method | Route | Access |
|---|---|---|
| GET | `/dashboard/summary` | All roles |
| GET | `/dashboard/recent` | All roles |
| GET | `/dashboard/category` | All roles |
| GET | `/dashboard/finance/monthly` | Admin, Analyst |
| GET | `/dashboard/finance/quarterly` | Admin, Analyst |
| GET | `/dashboard/finance/yearly` | Admin, Analyst |
| GET | `/dashboard/category-breakdown` | Admin, Analyst |

### Budget
| Method | Route | Access |
|---|---|---|
| POST | `/budget` | Admin |
| GET | `/budget/check` | Admin, Analyst |

### Users
| Method | Route | Access |
|---|---|---|
| GET | `/users` | Admin |

---

## Testing

```bash
cd backend
npm test
```

Tests cover auth endpoints, RBAC enforcement, and core record operations using Jest + Supertest.

---

## API Testing with Swagger

1. Open https://finance-data-processing-access-control-lxp4.onrender.com/api-docs
2. Call `POST /auth/login` and copy the JWT token
3. Click **Authorize** and paste the token
4. Access any protected route

---

## Deployment Notes

### Backend — Render (Linux)

Prisma schema includes Linux binary targets to avoid `PrismaClientInitializationError` on Render:

```prisma
binaryTargets = ["native", "debian-openssl-3.0.x", "debian-openssl-1.1.x"]
```

`postinstall` in `backend/package.json` auto-runs `prisma generate && prisma db push` on deploy.

Set these environment variables in Render:
- `JWT_SECRET`
- `DATABASE_URL`

### Frontend — Static Hosting (Vercel / Netlify)

```bash
cd frontend && npm run build
```

Set `VITE_API_URL` to your production backend URL before building.

---

## Design Decisions

- **Monorepo structure:** Backend and frontend are fully decoupled under `backend/` and `frontend/` with npm workspaces at the root for convenience.
- **RBAC via middleware:** Clean, composable `role.middleware.js` applied per route — straightforward for this scale, easily extended.
- **Raw SQL for analytics:** Used for aggregation queries (monthly/quarterly/yearly, EBITDA, PAT) where Prisma's query builder adds unnecessary overhead.
- **SQLite for development:** Simple file-based setup; `DATABASE_URL` can be swapped for PostgreSQL/MySQL in production with no code changes.
- **Swagger in `app.js`:** Kept centralized for simplicity; can be extracted to `src/config/swagger.js` for larger projects.
- **Frontend MVC pattern:** Controllers handle API calls, models define data shapes, services manage auth state — keeps pages thin and logic reusable.

---

## Tradeoffs

| Decision | Reason | Limitation |
|---|---|---|
| SQLite | Fast setup, zero config | Not suitable for concurrent production load |
| Fixed 10% tax rate | Keeps focus on backend architecture | Not a real accounting model |
| Raw SQL for analytics | Better aggregation performance | Less portable across DB engines |
| RBAC via middleware | Simple and composable | Less flexible than policy-based systems (e.g., CASL) |
| Limited test coverage | Time constraints | Auth and core flow only; no analytics or budget tests yet |

---

## Troubleshooting

**`PrismaClientInitializationError` on Linux/Render**
```bash
cd backend && npx prisma generate
```

**Frontend can't reach backend**
- Confirm backend is on `http://localhost:3000`
- Check `frontend/.env` has `VITE_API_URL=http://localhost:3000`
- Restart the Vite dev server after changing `.env`

**`permission denied` on prisma binary**
```bash
cd backend && chmod +x node_modules/.bin/prisma && npm install
```

---

## Conclusion

This project demonstrates a production-aware full-stack setup — monorepo architecture, JWT + RBAC security, financial analytics with EBITDA/PAT calculations, and real deployment on Render. Both apps are independently deployable and the backend is database-agnostic by design.