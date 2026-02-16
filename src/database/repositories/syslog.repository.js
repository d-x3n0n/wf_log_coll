/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const { getConnection } = require('../index');

const insert = (syslog) => {
  const db = getConnection();
  const stmt = db.prepare(`
    INSERT INTO syslogs (
      facility, severity, priority, timestamp, source_ip,
      hostname, app_name, proc_id, msg_id, message, raw_message, structured_data
    ) VALUES (
      @facility, @severity, @priority, @timestamp, @sourceIp,
      @hostname, @appName, @procId, @msgId, @message, @rawMessage, @structuredData
    )
  `);

  const result = stmt.run({
    facility: syslog.facility,
    severity: syslog.severity,
    priority: syslog.priority,
    timestamp: syslog.timestamp,
    sourceIp: syslog.sourceIp,
    hostname: syslog.hostname || null,
    appName: syslog.appName || null,
    procId: syslog.procId || null,
    msgId: syslog.msgId || null,
    message: syslog.message,
    rawMessage: syslog.rawMessage,
    structuredData: syslog.structuredData ? JSON.stringify(syslog.structuredData) : null
  });

  return result.lastInsertRowid;
};

const insertBatch = (syslogs) => {
  const db = getConnection();
  const stmt = db.prepare(`
    INSERT INTO syslogs (
      facility, severity, priority, timestamp, source_ip,
      hostname, app_name, proc_id, msg_id, message, raw_message, structured_data
    ) VALUES (
      @facility, @severity, @priority, @timestamp, @sourceIp,
      @hostname, @appName, @procId, @msgId, @message, @rawMessage, @structuredData
    )
  `);

  const insertMany = db.transaction((logs) => {
    for (const syslog of logs) {
      stmt.run({
        facility: syslog.facility,
        severity: syslog.severity,
        priority: syslog.priority,
        timestamp: syslog.timestamp,
        sourceIp: syslog.sourceIp,
        hostname: syslog.hostname || null,
        appName: syslog.appName || null,
        procId: syslog.procId || null,
        msgId: syslog.msgId || null,
        message: syslog.message,
        rawMessage: syslog.rawMessage,
        structuredData: syslog.structuredData ? JSON.stringify(syslog.structuredData) : null
      });
    }
  });

  insertMany(syslogs);
  return syslogs.length;
};

const findAll = (page = 1, limit = 50) => {
  const db = getConnection();
  const offset = (page - 1) * limit;

  const stmt = db.prepare(`
    SELECT * FROM syslogs
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `);

  return stmt.all(limit, offset);
};

const findById = (id) => {
  const db = getConnection();
  const stmt = db.prepare('SELECT * FROM syslogs WHERE id = ?');
  return stmt.get(id);
};

const search = (filters, page = 1, limit = 50) => {
  const db = getConnection();
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (filters.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filters.endDate);
  }

  if (filters.severity !== undefined) {
    conditions.push('severity = ?');
    params.push(filters.severity);
  }

  if (filters.sourceIp) {
    conditions.push('source_ip = ?');
    params.push(filters.sourceIp);
  }

  if (filters.hostname) {
    conditions.push('hostname LIKE ?');
    params.push(`%${filters.hostname}%`);
  }

  let query = 'SELECT * FROM syslogs';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';

  params.push(limit, offset);

  const stmt = db.prepare(query);
  return stmt.all(...params);
};

const count = (filters = {}) => {
  const db = getConnection();
  const conditions = [];
  const params = [];

  if (filters.startDate) {
    conditions.push('timestamp >= ?');
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    conditions.push('timestamp <= ?');
    params.push(filters.endDate);
  }

  if (filters.severity !== undefined) {
    conditions.push('severity = ?');
    params.push(filters.severity);
  }

  if (filters.sourceIp) {
    conditions.push('source_ip = ?');
    params.push(filters.sourceIp);
  }

  if (filters.hostname) {
    conditions.push('hostname LIKE ?');
    params.push(`%${filters.hostname}%`);
  }

  let query = 'SELECT COUNT(*) as count FROM syslogs';
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const stmt = db.prepare(query);
  const result = stmt.get(...params);
  return result.count;
};

const getStats = () => {
  const db = getConnection();

  const total = db.prepare('SELECT COUNT(*) as count FROM syslogs').get().count;

  const bySeverity = db.prepare(`
    SELECT severity, COUNT(*) as count
    FROM syslogs
    GROUP BY severity
    ORDER BY severity
  `).all();

  const byHour = db.prepare(`
    SELECT strftime('%Y-%m-%d %H:00:00', timestamp) as hour, COUNT(*) as count
    FROM syslogs
    WHERE timestamp >= datetime('now', '-24 hours')
    GROUP BY hour
    ORDER BY hour DESC
  `).all();

  const topSources = db.prepare(`
    SELECT source_ip, COUNT(*) as count
    FROM syslogs
    GROUP BY source_ip
    ORDER BY count DESC
    LIMIT 10
  `).all();

  return {
    total,
    bySeverity,
    byHour,
    topSources
  };
};

const deleteById = (id) => {
  const db = getConnection();
  const stmt = db.prepare('DELETE FROM syslogs WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

module.exports = {
  insert,
  insertBatch,
  findAll,
  findById,
  search,
  count,
  getStats,
  deleteById
};
