/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const requestLogger = require('./middleware/request-logger');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');

const app = express();

app.use(helmet());
app.use(cors(config.server.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.server.rateLimit.windowMs,
  max: config.server.rateLimit.max,
  message: { success: false, error: { message: 'Too many requests', statusCode: 429 } }
});
app.use('/api/', limiter);

app.use(requestLogger);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
