/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
require('dotenv').config();

const database = require('./database.config');
const server = require('./server.config');
const syslog = require('./syslog.config');

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  database,
  server,
  syslog
};
