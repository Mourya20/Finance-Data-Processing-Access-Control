## Finance Data Processing & Access Control Backend
A secure, high-performance backend system for a financial dashboard. This project manages financial records and provides advanced analytics through a robust Role-Based Access Control (RBAC) system. It is designed to demonstrate clean architecture, secure data processing, and meaningful financial insights beyond basic CRUD operations.

## Live Application

- API Base URL: https://finance-data-processing-access-control-lxp4.onrender.com
- Swagger API Documentation: https://finance-data-processing-access-control-lxp4.onrender.com/api-docs

## Technology Stack

- Backend: Node.js with Express.js
- Database: SQLite
- ORM: Prisma
- Authentication: JWT (JSON Web Tokens)
- API Documentation: Swagger UI
- Testing: Jest and Supertest
- Deployment: Render (Linux)

## Core Features

- Authentication and Authorization
- Financial record management
- Financial analytics and dashboards
- Role-based access control
- Rate limiting and security

## Authentication and Authorization

- JWT-based secure authentication
- Role-Based Access Control (RBAC) using middleware
- Protected routes based on roles
- Rate limiting for API protection

## Financial Record Management

- Full CRUD operations for financial records

**Each record includes:**

- Amount
- Type (Income / Expense)
- Category
- Date
- Notes

**Additional capabilities:**

- Pagination
- Filtering
- Search
- Soft delete support

## Financial Analytics

**Summary Metrics:**

- Total income
- Total expenses
- Net balance

**Time-Based Analytics:**

- Monthly
- Quarterly
- Yearly

**Advanced Metrics:**

- EBITDA
- PAT (Profit After Tax)
- Category-wise expense breakdown (sorted by highest spending)

## Budget Tracking

- Define budgets per category
- Compare actual performance vs limit
- Monitor category spending against budgets

## Testing and Validation

- Unit and integration testing using Jest and Supertest
- API validation through Swagger
- Proper status codes and error handling

## Role-Based Access Control

- Admin: Full access, manage users, CRUD operations
- Analyst: View records and analytics
- Viewer: Dashboard-only access

## Project Structure

│
├── node_modules
├── src/
│   ├── controllers/        # Request/response logic
│   ├── routes/             # API routes
│   ├── services/           # Business logic (Prisma)
│   ├── middleware/         # Auth, RBAC, rate limiting, errors
│   ├── utils/              # Prisma client, JWT helpers
│   └── config/             # Swagger & environment config
│
├── prisma/
│   ├── schema.prisma       # Database schema definition
│   └── migrations/         # Version-controlled database migrations
│
├── tests/                  # Unit and integration tests
│
├── app.js                  # Express application configuration
├── server.js               # Application entry point
|
├── .env                    # Environment variables
├── package.json
├── package-lock.json
├──API_Documentation.md
└── README.md

## Local Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env` file:

```env
JWT_SECRET=your_secret_key
DATABASE_URL="file:./prisma/dev.db"
```

3. Setup database:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Run server:

```bash
npm start
```

Application URL:

- http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs

5. Run tests (optional):

```bash
npm test
```

## Deployment Notes (Linux Environment)

- The project is hosted on Render.
- Prisma is configured for Linux deploys.

**Prisma fix:**

```prisma
binaryTargets = ["native", "debian-openssl-3.0.x"]
```

**Additional fixes:**

- Ensured Prisma client generation during deployment
- Fixed schema path issues
- Resolved case-sensitivity issues
- Proper environment variable handling

## API Overview

**Authentication**

- POST /auth/register
- POST /auth/login

**Records**

- GET /records
- POST /records (Admin only)
- PUT /records/:id
- DELETE /records/:id

**Dashboard & Analytics**

- GET /dashboard/summary
- GET /dashboard/recent
- GET /dashboard/category
- GET /dashboard/finance/monthly
- GET /dashboard/finance/quarterly
- GET /dashboard/finance/yearly
- GET /dashboard/category-breakdown

**Budget**

- POST /budget
- GET /budget/check

## API Testing with Swagger

**Workflow:**

- Call `/auth/login`
- Copy JWT token
- Click Authorize
- Paste token
- Access protected routes

**Validation includes:**

- Correct responses
- Status codes (200, 201, 401, 403)
- RBAC enforcement

## Design Decisions

- RBAC implemented using middleware
- Prisma for structured database interaction
- Raw SQL used for efficient analytics
- Modular API structure

## Assumptions

- Tax is fixed at 10% of profit
- All expenses are treated as operating expenses
- SQLite is used for simplicity

## Trade-offs

- SQLite chosen for simplicity over scalability
- Simplified financial calculations
- Raw SQL improves performance but reduces portability
- Middleware RBAC instead of advanced policy systems
- Limited test coverage

## Additional Notes

- Swagger is integrated within the application
- APIs are tested manually using Swagger
- Debugging focused on JWT issues, JSON formatting, and Prisma errors

## Conclusion

- Clean backend architecture
- Secure role-based access control
- Financial analytics system
- Real-world deployment handling

This project reflects backend fundamentals such as API design, database management, and production-level considerations.
