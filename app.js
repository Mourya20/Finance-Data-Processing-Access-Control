require('dotenv').config();
const express = require('express');
const rateLimit = require('./src/middleware/rateLimit');

const app = express();

app.use(express.json());
app.use(rateLimit);
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); //swagger file
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// routes
app.use('/auth', require('./src/routes/auth.routes'));
app.use('/records', require('./src/routes/record.routes'));
app.use('/dashboard', require('./src/routes/dashboard.routes'));
app.use('/budget', require('./src/routes/budget.routes'));

// logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// health route
app.get('/', (req, res) => {
  res.send("API Running");
});
module.exports = app;