/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const syslogService = require('../services/syslog.service');
const { success, error, paginated } = require('../utils/response');

const getAll = (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    const { logs, total } = syslogService.getAllLogs(page, limit);
    return paginated(res, logs, page, limit, total);
  } catch (err) {
    next(err);
  }
};

const getById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const log = syslogService.getLogById(id);

    if (!log) {
      return error(res, 'Syslog entry not found', 404);
    }

    return success(res, log);
  } catch (err) {
    next(err);
  }
};

const search = (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      severity: req.query.severity !== undefined ? parseInt(req.query.severity, 10) : undefined,
      sourceIp: req.query.sourceIp,
      hostname: req.query.hostname
    };

    const { logs, total } = syslogService.searchLogs(filters, page, limit);
    return paginated(res, logs, page, limit, total);
  } catch (err) {
    next(err);
  }
};

const getStats = (req, res, next) => {
  try {
    const stats = syslogService.getStats();
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

const deleteById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = syslogService.deleteLog(id);

    if (!deleted) {
      return error(res, 'Syslog entry not found', 404);
    }

    return success(res, { message: 'Syslog entry deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  search,
  getStats,
  deleteById
};
