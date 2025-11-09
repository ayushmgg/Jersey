import express from 'express';
import Jersey from '../models/Jersey.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all jerseys (with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const { team, category, player, page = 1, limit = 20, sort = '-popularityScore' } = req.query;
    
    const query = {};
    if (team) query.team = new RegExp(team, 'i');
    if (category) query.category = category;
    if (player) query.player = new RegExp(player, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jerseys = await Jersey.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Jersey.countDocuments(query);

    res.json({
      success: true,
      data: jerseys,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single jersey
router.get('/:id', async (req, res, next) => {
  try {
    const jersey = await Jersey.findById(req.params.id).lean();
    
    if (!jersey) {
      return res.status(404).json({
        success: false,
        error: 'Jersey not found'
      });
    }

    res.json({
      success: true,
      data: jersey
    });
  } catch (error) {
    next(error);
  }
});

// Create jersey (admin only - add admin check in production)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const jersey = await Jersey.create(req.body);
    
    logger.info('Jersey created', {
      correlationId: req.correlationId,
      jerseyId: jersey._id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: jersey
    });
  } catch (error) {
    next(error);
  }
});

// Update jersey
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const jersey = await Jersey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!jersey) {
      return res.status(404).json({
        success: false,
        error: 'Jersey not found'
      });
    }

    logger.info('Jersey updated', {
      correlationId: req.correlationId,
      jerseyId: jersey._id,
      userId: req.user.id
    });

    res.json({
      success: true,
      data: jersey
    });
  } catch (error) {
    next(error);
  }
});

// Delete jersey
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const jersey = await Jersey.findByIdAndDelete(req.params.id);

    if (!jersey) {
      return res.status(404).json({
        success: false,
        error: 'Jersey not found'
      });
    }

    logger.info('Jersey deleted', {
      correlationId: req.correlationId,
      jerseyId: req.params.id,
      userId: req.user.id
    });

    res.json({
      success: true,
      message: 'Jersey deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

