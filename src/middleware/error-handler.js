/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const logger = require('../utils/logger');
const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  if (err.name === 'ValidationError') {
    return error(res, 'Validation failed', 400, err.details);
  }

  if (err.name === 'UnauthorizedError') {
    return error(res, 'Unauthorized', 401);
  }

  if (err.code === 'SQLITE_ERROR') {
    return error(res, 'Database error', 500);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return error(res, message, statusCode);
};

const notFoundHandler = (req, res) => {
  return error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
