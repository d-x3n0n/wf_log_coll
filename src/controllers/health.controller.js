/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const { success } = require('../utils/response');
const { getConnection } = require('../database');

const healthCheck = (req, res) => {
  let dbStatus = 'ok';

  try {
    const db = getConnection();
    db.prepare('SELECT 1').get();
  } catch (err) {
    dbStatus = 'error';
  }

  const health = {
    status: dbStatus === 'ok' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return res.status(statusCode).json(health);
};

module.exports = {
  healthCheck
};
