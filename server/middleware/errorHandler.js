import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.correlationId || 'unknown';
  
  logger.error('Error occurred', {
    correlationId,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    correlationId,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

