Finance Data Processing & Access Control Backend

A secure, high-performance backend system for a financial dashboard. This project manages financial records and provides advanced analytics through a robust Role-Based Access Control (RBAC) system.

It is designed to demonstrate clean backend architecture, secure data processing, and meaningful financial insights beyond basic CRUD operations.

🚀 Live Links
Live API Base URL
https://finance-data-processing-access-control-lxp4.onrender.com
Swagger API Docs (Live)
https://finance-data-processing-access-control-lxp4.onrender.com/api-docs
🛠 Tech Stack
Backend: Node.js, Express.js
Database: SQLite
ORM: Prisma
Authentication: JWT (JSON Web Tokens)
Testing: Jest, Supertest
Documentation: Swagger UI (swagger-ui-express, swagger-jsdoc)
Deployment: Render (Linux Environment)
🔑 Key Features
1. Authentication & Authorization
JWT-based secure authentication
Role-Based Access Control (RBAC)
Rate limiting for API protection
2. Financial Management
Full CRUD operations
Fields:
amount
type (Income / Expense)
category
date
notes
Pagination, filtering, and search support
3. Financial Analytics & Insights
Summary:
Total income
Total expenses
Net balance
Time-based analytics:
Monthly
Quarterly
Yearly
Advanced metrics:
EBITDA
PAT (Profit After Tax)
Category-wise expense breakdown (sorted by highest spending)
4. Budget Tracking
Set category-specific budgets
Compare actual spending vs limits
5. Additional Enhancements
Soft delete support
Rate limiting
Swagger API documentation
Unit & integration testing
👥 Roles Explanation
Role	Permissions
Admin	Full access, manage users, full CRUD
Analyst	View records + access analytics
Viewer	View dashboard only (no raw records)
📂 Project Structure
│
├── src/
│   ├── controllers/        # Handles request & response logic
│   │
│   ├── routes/             # Defines API endpoints
│   │
│   ├── services/           # Business logic & Prisma queries
│   │
│   ├── middleware/         # Auth, RBAC, Rate Limiting, Error handling
│   │
│   ├── utils/              # Prisma client, JWT helpers, constants
│   │
│   └── config/             # Swagger config & environment setup
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Prisma migrations
│
├── tests/                  # Jest + Supertest (unit & integration tests)
│
├── app.js                  # Express app configuration
├── server.js               # Server entry point
│
├── .env                    # Environment variables
├── package.json
├── package-lock.json
│
└── README.md               # Project documentation
⚙️ Local Setup
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
Local URL: http://localhost:3000
Swagger Docs: http://localhost:3000/api-docs
🧪 Run Tests (Optional)
npm test
🐧 Linux Deployment (Render)

Since the project was developed on Windows and deployed on Linux, the following fixes were applied:

Prisma Configuration
binaryTargets = ["native", "debian-openssl-3.0.x"]
Deployment Fixes
Ensured prisma generate runs during build
Fixed schema path issues
Resolved case-sensitivity problems
Adjusted CLI commands for Linux
Proper environment variable loading
📖 Swagger API Testing

Swagger UI is integrated for interactive API testing:

Open /api-docs
Use "Try it out"
Provide request payloads
Use Authorize button (JWT)
Testing Flow
Call /auth/login
Copy JWT token
Authorize in Swagger
Access protected routes
Verified:
Status codes (200, 201, 401, 403)
RBAC restrictions
Data correctness
📌 API Endpoints
🔐 Auth
POST /auth/register
POST /auth/login
📁 Records
GET /records
POST /records (Admin)
PUT /records/:id
DELETE /records/:id
📊 Dashboard & Analytics
GET /dashboard/summary
GET /dashboard/recent
GET /dashboard/category
GET /dashboard/finance/monthly
GET /dashboard/finance/quarterly
GET /dashboard/finance/yearly
GET /dashboard/category-breakdown
💰 Budget
POST /budget
GET /budget/check
📝 Design Notes
RBAC implemented via middleware
Prisma used for structured DB access
Raw SQL used for efficient analytics queries
APIs grouped into summary, analytics, and insights
⚖️ Assumptions
Tax = 10% of profit (simplified)
All expenses treated as operating expenses
SQLite used for simplicity
⚖️ Trade-offs
SQLite over scalable DBs
→ Simple setup, not ideal for production scale
Simplified financial calculations
→ Focus on backend logic over accounting accuracy
Raw SQL for analytics
→ Better performance, less portability
Middleware RBAC
→ Simpler than policy engines, less flexible
Limited test coverage
→ Focused on core functionality
📌 Additional Notes
Swagger integrated directly (no separate config initially)
APIs tested manually via Swagger
Debugging handled:
JSON formatting issues
JWT headers
Prisma errors (e.g., record not found)
Deployment required environment-specific fixes
✅ Conclusion

This project demonstrates:

Clean backend architecture
Secure role-based access control
Financial data processing & analytics
Real-world deployment handling (Linux compatibility)

It goes beyond basic CRUD by incorporating analytics, validation, structured APIs, and production-like considerations.
