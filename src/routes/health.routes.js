/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/', healthController.healthCheck);

module.exports = router;
