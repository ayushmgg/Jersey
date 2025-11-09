import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    logger.debug('User authenticated', {
      correlationId: req.correlationId,
      userId: decoded.id
    });
    
    next();
  } catch (error) {
    logger.warn('Token verification failed', {
      correlationId: req.correlationId,
      error: error.message
    });
    
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

