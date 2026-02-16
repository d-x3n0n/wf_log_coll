/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
module.exports = {
  port: parseInt(process.env.HTTP_PORT, 10) || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  },
  apiKey: process.env.API_KEY || 'your-secure-api-key-here'
};
