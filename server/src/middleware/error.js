import { ApiError } from '../utils/apiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for ${Object.keys(err.keyPattern || {}).join(', ')}`;
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier';
  }

  res.status(statusCode).json({
    message,
    details: err.details,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}
