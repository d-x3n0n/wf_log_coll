/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const express = require('express');
const router = express.Router();
const syslogController = require('../controllers/syslog.controller');
const { apiKeyAuth } = require('../middleware/auth');
const { validate, paginationRules, searchRules, idParamRules } = require('../middleware/validator');

router.use(apiKeyAuth);

router.get('/', paginationRules, validate, syslogController.getAll);
router.get('/search', searchRules, validate, syslogController.search);
router.get('/stats', syslogController.getStats);
router.get('/:id', idParamRules, validate, syslogController.getById);
router.delete('/:id', idParamRules, validate, syslogController.deleteById);

module.exports = router;

