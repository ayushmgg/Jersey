import express from 'express';
import Joi from 'joi';
import Interaction from '../models/Interaction.js';
import Jersey from '../models/Jersey.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { deleteCache } from '../utils/cache.js';

const router = express.Router();

// Validation schema
const interactionSchema = Joi.object({
  jerseyId: Joi.string().required(),
  type: Joi.string().valid('view', 'cart', 'purchase').required(),
  metadata: Joi.object({
    duration: Joi.number().optional(),
    quantity: Joi.number().optional()
  }).optional()
});

// Record interaction
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error, value } = interactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { jerseyId, type, metadata } = value;
    const userId = req.user.id;

    // Verify jersey exists
    const jersey = await Jersey.findById(jerseyId);
    if (!jersey) {
      return res.status(404).json({
        success: false,
        error: 'Jersey not found'
      });
    }

    // Create interaction
    const interaction = await Interaction.create({
      userId,
      jerseyId,
      type,
      metadata
    });

    // Update jersey popularity score
    if (type === 'purchase') {
      jersey.popularityScore = (jersey.popularityScore || 0) + 10;
    } else if (type === 'cart') {
      jersey.popularityScore = (jersey.popularityScore || 0) + 3;
    } else {
      jersey.popularityScore = (jersey.popularityScore || 0) + 1;
    }
    await jersey.save();

    // Invalidate user's recommendation cache
    await deleteCache(`recommendations:${userId}`);

    logger.info('Interaction recorded', {
      correlationId: req.correlationId,
      userId,
      jerseyId,
      type
    });

    res.status(201).json({
      success: true,
      data: interaction
    });
  } catch (error) {
    next(error);
  }
});

// Get user interactions
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { type, limit = 50 } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const interactions = await Interaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('jerseyId', 'team player category imageUrl price')
      .lean();

    res.json({
      success: true,
      data: interactions
    });
  } catch (error) {
    next(error);
  }
});

export default router;

