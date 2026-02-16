/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const syslogRoutes = require('./syslog.routes');

router.use('/health', healthRoutes);
router.use('/api/v1/syslogs', syslogRoutes);

module.exports = router;
