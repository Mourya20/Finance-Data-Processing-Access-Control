# API Documentation

## Base URL

- **Local:** http://localhost:3000
- **Production:** https://finance-data-processing-access-control-lxp4.onrender.com

### Swagger UI (Live Testing):
https://finance-data-processing-access-control-lxp4.onrender.com/api-docs

---

## Overview

This API provides backend services for managing financial records, generating analytics, and enforcing role-based access control (RBAC).

The system supports different user roles (Admin, Analyst, Viewer), and each role has different permissions for accessing and modifying data.

All APIs were tested using Swagger UI after deployment.

---

## Authentication

The system uses JWT (JSON Web Token) based authentication.

### Header Format

All protected routes require this header:

```
Authorization: Bearer <token>
```

### How Authentication Works

1. Register a user using `/auth/register`
2. Login using `/auth/login`
3. Copy the JWT token from response
4. Use the token:
   - In Swagger → Authorize button
   - Or in request headers

---

## Auth APIs

### Register User

**POST** `/auth/register`

Creates a new user.

**Request:**

```json
{
  "email": "user@test.com",
  "password": "123456",
  "role": "ADMIN"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@test.com",
    "role": "ADMIN"
  }
}
```

---

### Login User

**POST** `/auth/login`

Authenticates user and returns a JWT token.

**Request:**

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

## Records APIs

These APIs are used to manage financial records like income and expenses.

### Create Record (Admin only)

**POST** `/records`

**Headers:**

```
Authorization: Bearer <token>
```

**Request:**

```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "notes": "Monthly salary",
  "date": "2026-04-04"
}
```

**Notes:**

- `date` is optional (auto-generated if not provided)
- Only Admin users can create records

---

### Get Records

**GET** `/records?page=1&limit=5&search=Salary`

**Headers:**

```
Authorization: Bearer <token>
```

**Description:**

Returns list of records with optional:
- Pagination (page, limit)
- Search (search)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 5000,
      "category": "Salary"
    }
  ]
}
```

---

### Update Record (Admin only)

**PUT** `/records/:id`

**Request:**

```json
{
  "amount": 1200,
  "category": "Travel"
}
```

**Notes:**

- Only Admin can update
- ID must exist
- Returns 404 if record not found

---

### Delete Record (Admin only)

**DELETE** `/records/:id`

**Notes:**

- Only Admin can delete records
- Returns error if record does not exist

---

## Dashboard APIs

These APIs provide financial insights and analytics.

### Summary

**GET** `/dashboard/summary`

**Response:**

```json
{
  "totalIncome": 10000,
  "totalExpense": 5000,
  "netBalance": 5000
}
```

---

### Recent Activity

**GET** `/dashboard/recent`

Returns latest transactions.

---

### Category Totals

**GET** `/dashboard/category`

Returns category-wise totals.

---

## Financial Analytics

### Monthly

**GET** `/dashboard/finance/monthly`

### Quarterly

**GET** `/dashboard/finance/quarterly`

### Yearly

**GET** `/dashboard/finance/yearly`

**Response Example:**

```json
[
  {
    "period": "2026-01",
    "income": 10000,
    "expense": 4000,
    "ebitda": 6000,
    "pat": 5400
  }
]
```

---

### Category Breakdown

**GET** `/dashboard/category-breakdown`

Returns expense distribution sorted by highest spending.

---

## Budget APIs

### Create Budget (Admin only)

**POST** `/budget`

**Request:**

```json
{
  "category": "Food",
  "limit": 5000
}
```

---

### Check Budget

**GET** `/budget/check`

**Response:**

```json
[
  {
    "category": "Food",
    "limit": 5000,
    "spent": 3000,
    "exceeded": false
  }
]
```

---

## Role-Based Access Control (RBAC)

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View Dashboard | Yes | Yes | Yes |
| View Records | No | Yes | Yes |
| Create Record | No | No | Yes |
| Update Record | No | No | Yes |
| Delete Record | No | No | Yes |

---

## Status Codes

- **200** → Success
- **201** → Resource created
- **400** → Invalid input
- **401** → Unauthorized
- **403** → Forbidden
- **404** → Not found
- **500** → Internal server error

---

## Error Examples

```json
{
  "success": false,
  "error": "Invalid input"
}
```

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Record not found"
}
```

---

## Notes

- All protected APIs require JWT authentication
- Swagger UI was used to test all APIs after deployment
- Token must be added using Authorize button in Swagger
- Date field is handled internally if not provided
- Financial calculations use simplified logic
- Tax is assumed as 10% of profit
- All expenses are treated as operating expenses

---

## Summary

This API provides a complete backend solution for managing financial data with role-based access control, analytics, and budgeting features. The system is deployed on Render and tested using Swagger UI to ensure all endpoints work correctly in a real environment.
