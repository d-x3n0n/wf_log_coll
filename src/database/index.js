/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const config = require('../config');
const logger = require('../utils/logger');

let db = null;

const initialize = () => {
  const dbPath = path.resolve(config.database.path);
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath, config.database.options);

  if (config.database.walMode) {
    db.pragma('journal_mode = WAL');
  }

  logger.info(`Database connected: ${dbPath}`);
  return db;
};

const getConnection = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initialize() first.');
  }
  return db;
};

const close = () => {
  if (db) {
    db.close();
    logger.info('Database connection closed');
    db = null;
  }
};

module.exports = {
  initialize,
  getConnection,
  close
};
