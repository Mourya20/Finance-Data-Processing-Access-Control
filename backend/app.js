require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('./src/middleware/rateLimit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();

app.set('trust proxy', 1);

// CORS — allow localhost dev and any deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://finance-data-processing-access-cont-alpha.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Swagger UI, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(rateLimit);

// LOGGER
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// SWAGGER
const PRODUCTION_URL = 'https://finance-data-processing-access-control-lxp4.onrender.com';
const BASE_URL = process.env.NODE_ENV === 'production'
  ? PRODUCTION_URL
  : `http://localhost:${process.env.PORT || 3000}`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Backend API',
      version: '1.0.0',
      description: 'Finance Management System with RBAC. Login via /auth/login, copy the token, click Authorize and paste it.'
    },
    servers: [
      { url: PRODUCTION_URL, description: 'Production (Render)' },
      { url: 'http://localhost:3000', description: 'Local Development' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'role'],
                  properties: {
                    email: { type: 'string', example: 'admin@test.com' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', enum: ['ADMIN', 'ANALYST', 'VIEWER'], example: 'ADMIN' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User created' },
            400: { description: 'Validation error or email already exists' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@test.com' },
                    password: { type: 'string', example: 'password123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Returns JWT token' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/records': {
        get: {
          tags: ['Records'],
          security: [{ bearerAuth: [] }],
          summary: 'Get all records (Admin, Analyst)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', example: 10 } },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Records list' }, 401: { description: 'Unauthorized' } }
        },
        post: {
          tags: ['Records'],
          security: [{ bearerAuth: [] }],
          summary: 'Create record (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'type', 'category'],
                  properties: {
                    amount: { type: 'number', example: 1000 },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' },
                    category: { type: 'string', example: 'Food' },
                    notes: { type: 'string', example: 'Monthly groceries' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Record created' }, 403: { description: 'Forbidden' } }
        }
      },
      '/records/{id}': {
        put: {
          tags: ['Records'],
          security: [{ bearerAuth: [] }],
          summary: 'Update record (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', example: 1200 },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                    category: { type: 'string', example: 'Travel' },
                    notes: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Updated' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } }
        },
        delete: {
          tags: ['Records'],
          security: [{ bearerAuth: [] }],
          summary: 'Delete record (Admin only)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' }, 403: { description: 'Forbidden' } }
        }
      },
      '/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'Financial summary — total income, expenses, net balance',
          responses: { 200: { description: 'Summary data' }, 401: { description: 'Unauthorized' } }
        }
      },
      '/dashboard/recent': {
        get: {
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'Recent transactions',
          responses: { 200: { description: 'Recent records' } }
        }
      },
      '/dashboard/category': {
        get: {
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'Category-wise totals',
          responses: { 200: { description: 'Category totals' } }
        }
      },
      '/dashboard/category-breakdown': {
        get: {
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          summary: 'Expense breakdown sorted by highest spending',
          responses: { 200: { description: 'Breakdown data' } }
        }
      },
      '/dashboard/finance/monthly': {
        get: {
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          summary: 'Monthly income vs expense analytics',
          responses: { 200: { description: 'Monthly data' } }
        }
      },
      '/dashboard/finance/quarterly': {
        get: {
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          summary: 'Quarterly analytics with EBITDA and PAT',
          responses: { 200: { description: 'Quarterly data' } }
        }
      },
      '/dashboard/finance/yearly': {
        get: {
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          summary: 'Yearly analytics with EBITDA and PAT',
          responses: { 200: { description: 'Yearly data' } }
        }
      },
      '/budget': {
        post: {
          tags: ['Budget'],
          security: [{ bearerAuth: [] }],
          summary: 'Create or update budget for a category (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['category', 'limit'],
                  properties: {
                    category: { type: 'string', example: 'Food' },
                    limit: { type: 'number', example: 5000 }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Budget set' }, 403: { description: 'Forbidden' } }
        }
      },
      '/budget/check': {
        get: {
          tags: ['Budget'],
          security: [{ bearerAuth: [] }],
          summary: 'Check actual spending vs budget limits',
          responses: { 200: { description: 'Budget comparison' } }
        }
      },
      '/users': {
        get: {
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          summary: 'Get all users (Admin only)',
          responses: { 200: { description: 'Users list' }, 403: { description: 'Forbidden' } }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Expose swagger JSON for tools/import
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ROUTES
app.use('/auth', require('./src/routes/auth.routes'));
app.use('/records', require('./src/routes/record.routes'));
app.use('/dashboard', require('./src/routes/dashboard.routes'));
app.use('/budget', require('./src/routes/budget.routes'));
app.use('/users', require('./src/routes/users.routes'));

// ROOT
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Finance API is running',
    docs: '/api-docs'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ERROR
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
