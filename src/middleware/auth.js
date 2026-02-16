/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const config = require('../config');
const { error } = require('../utils/response');

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return error(res, 'API key is required', 401);
  }

  if (apiKey !== config.server.apiKey) {
    return error(res, 'Invalid API key', 401);
  }

  next();
};

module.exports = {
  apiKeyAuth
};
