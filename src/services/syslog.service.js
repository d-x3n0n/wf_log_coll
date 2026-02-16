/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const syslogRepository = require('../database/repositories/syslog.repository');

const getAllLogs = (page = 1, limit = 50) => {
  const logs = syslogRepository.findAll(page, limit);
  const total = syslogRepository.count();
  return { logs, total };
};

const getLogById = (id) => {
  return syslogRepository.findById(id);
};

const searchLogs = (filters, page = 1, limit = 50) => {
  const logs = syslogRepository.search(filters, page, limit);
  const total = syslogRepository.count(filters);
  return { logs, total };
};

const getStats = () => {
  return syslogRepository.getStats();
};

const deleteLog = (id) => {
  return syslogRepository.deleteById(id);
};

module.exports = {
  getAllLogs,
  getLogById,
  searchLogs,
  getStats,
  deleteLog
};
