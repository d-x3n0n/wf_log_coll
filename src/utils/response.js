/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const success = (res, data, statusCode = 200, meta = {}) => {
  const response = {
    success: true,
    data
  };

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const error = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    error: {
      message,
      statusCode
    }
  };

  if (errors) {
    response.error.details = errors;
  }

  return res.status(statusCode).json(response);
};

const paginated = (res, data, page, limit, total) => {
  return success(res, data, 200, {
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  success,
  error,
  paginated
};
