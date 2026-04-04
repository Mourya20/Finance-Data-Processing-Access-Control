Finance Data Processing & Access Control Backend

A secure and scalable backend system for a financial dashboard that manages financial records and delivers advanced analytics using a robust Role-Based Access Control (RBAC) mechanism.

This project demonstrates clean backend architecture, secure authentication, and financial analytics beyond CRUD operations. It simulates real-world systems where different user roles interact with data based on permissions.

Live Application
API Base URL
https://finance-data-processing-access-control-lxp4.onrender.com
Swagger API Documentation
https://finance-data-processing-access-control-lxp4.onrender.com/api-docs

The Swagger interface allows interactive testing of all APIs, including authentication and protected routes.

Technology Stack
Backend: Node.js, Express.js
Database: SQLite
ORM: Prisma
Authentication: JWT (JSON Web Tokens)
API Docs: Swagger UI (swagger-ui-express, swagger-jsdoc)
Testing: Jest, Supertest
Deployment: Render (Linux)
Core Features
Authentication and Authorization
JWT-based secure authentication
Role-Based Access Control (RBAC) via middleware
Protected routes based on roles
Rate limiting for API protection
Financial Record Management
Full CRUD operations

Each record includes:

Amount
Type (Income / Expense)
Category
Date
Notes

Additional capabilities:

Pagination
Filtering
Search
Soft delete support
Financial Analytics

Summary Metrics:

Total income
Total expenses
Net balance

Time-Based Analytics:

Monthly
Quarterly
Yearly

Advanced Metrics:

EBITDA
PAT (Profit After Tax)
Category-wise expense breakdown (sorted by highest spending)
Budget Tracking
Define budgets per category
Compare actual vs limit
Helps in financial monitoring
Testing and Validation
Unit + integration tests (Jest, Supertest)
API validation via Swagger
Proper status codes and error handling
Role-Based Access Control
Role	Permissions
Admin	Full access, manage users, CRUD operations
Analyst	View records and analytics
Viewer	Dashboard-only access
Project Structure
zorovyn/
│
├── src/
│   ├── controllers/        # Request/response logic
│   ├── routes/             # API routes
│   ├── services/           # Business logic (Prisma)
│   ├── middleware/         # Auth, RBAC, rate limiting, errors
│   ├── utils/              # Prisma client, JWT helpers
│   └── config/             # Swagger & environment config
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│
├── app.js
├── server.js
│
├── .env
├── package.json
├── package-lock.json
│
└── README.md
Local Setup Instructions
1. Install Dependencies
npm install
2. Configure Environment

Create .env file:

JWT_SECRET=your_secret_key
DATABASE_URL="file:./prisma/dev.db"
3. Setup Database
npx prisma generate
npx prisma migrate dev
4. Run Server
npm start
App: http://localhost:3000
Swagger: http://localhost:3000/api-docs
5. Run Tests (Optional)
npm test
Deployment Notes (Linux)

Since the project was built on Windows and deployed on Linux:

Prisma Fix
binaryTargets = ["native", "debian-openssl-3.0.x"]
Other Fixes
Prisma generate during build
Fixed path issues
Case-sensitivity fixes
Environment variable handling
API Overview
Authentication
POST /auth/register
POST /auth/login
Records
GET /records
POST /records (Admin only)
PUT /records/:id
DELETE /records/:id
Dashboard
GET /dashboard/summary
GET /dashboard/recent
GET /dashboard/category
GET /dashboard/finance/monthly
GET /dashboard/finance/quarterly
GET /dashboard/finance/yearly
GET /dashboard/category-breakdown
Budget
POST /budget
GET /budget/check
API Testing (Swagger)

Workflow:

Call /auth/login
Copy token
Click Authorize
Paste token
Test endpoints

Validation includes:

Status codes (200, 201, 401, 403)
RBAC enforcement
Correct responses
Design Decisions
RBAC via middleware (simple & clear)
Prisma for structured DB access
Raw SQL for efficient analytics
Modular API design
Assumptions
Tax = 10% of profit
All expenses are operating expenses
SQLite used for simplicity
Trade-offs
SQLite over scalable DB → simplicity
Simplified calculations → clarity
Raw SQL → performance > portability
Middleware RBAC → simple but less flexible
Limited test coverage
Additional Notes
Swagger integrated inside app
APIs tested manually via Swagger
Debugging handled:
JWT issues
JSON errors
Prisma errors
Conclusion

This project demonstrates:

Clean backend architecture
Secure RBAC implementation
Financial analytics system
Real-world deployment handling

It reflects strong backend fundamentals including API design, database interaction, and production considerations.
