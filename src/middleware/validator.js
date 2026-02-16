/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const { validationResult, query, param } = require('express-validator');
const { error } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 'Validation failed', 400, errors.array());
  }
  next();
};

const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000')
];

const searchRules = [
  ...paginationRules,
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be valid ISO8601 format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be valid ISO8601 format'),
  query('severity')
    .optional()
    .isInt({ min: 0, max: 7 })
    .withMessage('Severity must be between 0 and 7'),
  query('sourceIp')
    .optional()
    .isIP()
    .withMessage('Source IP must be a valid IP address'),
  query('hostname')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Hostname must be between 1 and 255 characters')
];

const idParamRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

module.exports = {
  validate,
  paginationRules,
  searchRules,
  idParamRules
};
