import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  req.startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    correlationId,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    ip: req.ip
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    logger.info('Request completed', {
      correlationId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });

  res.setHeader('X-Correlation-ID', correlationId);
  next();
};

