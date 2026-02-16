/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const { getConnection } = require('../index');
const logger = require('../../utils/logger');

const createTable = () => {
  const db = getConnection();

  db.exec(`
    CREATE TABLE IF NOT EXISTS syslogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      facility INTEGER NOT NULL,
      severity INTEGER NOT NULL,
      priority INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      received_at TEXT DEFAULT (datetime('now')),
      source_ip TEXT NOT NULL,
      hostname TEXT,
      app_name TEXT,
      proc_id TEXT,
      msg_id TEXT,
      message TEXT NOT NULL,
      raw_message TEXT NOT NULL,
      structured_data TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_syslogs_timestamp ON syslogs(timestamp)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_syslogs_severity ON syslogs(severity)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_syslogs_source_ip ON syslogs(source_ip)`);

  logger.info('Syslog table and indexes created');
};

module.exports = {
  createTable
};
