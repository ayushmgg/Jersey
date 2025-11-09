import axios from 'axios';
import { logger } from './logger.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const ML_SERVICE_TIMEOUT = parseInt(process.env.ML_SERVICE_TIMEOUT || '2000');

const mlServiceClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: ML_SERVICE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getRecommendations = async (userId, userInteractions, correlationId) => {
  try {
    logger.info('Calling ML service for recommendations', {
      correlationId,
      userId,
      interactionCount: userInteractions.length
    });

    const response = await mlServiceClient.post('/predict', {
      userId,
      userInteractions
    }, {
      headers: {
        'X-Correlation-ID': correlationId
      }
    });

    logger.info('ML service response received', {
      correlationId,
      userId,
      recommendationCount: response.data?.recommendations?.length || 0
    });

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logger.warn('ML service timeout', {
        correlationId,
        userId,
        timeout: ML_SERVICE_TIMEOUT
      });
    } else {
      logger.error('ML service error', {
        correlationId,
        userId,
        error: error.message,
        status: error.response?.status
      });
    }
    throw error;
  }
};

