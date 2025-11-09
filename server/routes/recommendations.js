import express from 'express';
import Interaction from '../models/Interaction.js';
import Jersey from '../models/Jersey.js';
import { authenticate } from '../middleware/auth.js';
import { getCache, setCache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get recommendations for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `recommendations:${userId}:${limit}`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      logger.info('Cache hit for recommendations', {
        correlationId: req.correlationId,
        userId
      });
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // Get user interactions
    const interactions = await Interaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    let recommendations = [];

    // Simple Collaborative Filtering: Find users with similar interactions
    if (interactions.length > 0) {
      const userJerseyIds = interactions.map(i => i.jerseyId);
      
      // Find other users who interacted with the same jerseys
      const similarUsers = await Interaction.find({
        jerseyId: { $in: userJerseyIds },
        userId: { $ne: userId }
      })
        .distinct('userId')
        .lean();

      if (similarUsers.length > 0) {
        // Get jerseys that similar users liked (but current user hasn't seen)
        const recommendedInteractions = await Interaction.find({
          userId: { $in: similarUsers },
          jerseyId: { $nin: userJerseyIds },
          type: { $in: ['purchase', 'cart'] } // Focus on purchases and carts
        })
          .populate('jerseyId')
          .lean();

        // Count recommendations and score them
        const jerseyScores = new Map();
        recommendedInteractions.forEach(interaction => {
          if (interaction.jerseyId) {
            const jerseyId = interaction.jerseyId._id.toString();
            const currentScore = jerseyScores.get(jerseyId) || 0;
            // Weight by interaction type: purchase = 3, cart = 2
            const weight = interaction.type === 'purchase' ? 3 : 2;
            jerseyScores.set(jerseyId, currentScore + weight);
          }
        });

        // Get top recommended jersey IDs
        const sortedJerseyIds = Array.from(jerseyScores.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([jerseyId]) => jerseyId);

        if (sortedJerseyIds.length > 0) {
          const recommendedJerseys = await Jersey.find({
            _id: { $in: sortedJerseyIds },
            inStock: true
          }).lean();

          // Create map for ordering
          const jerseyMap = new Map(
            recommendedJerseys.map(j => [j._id.toString(), j])
          );

          recommendations = sortedJerseyIds
            .map(jerseyId => {
              const jersey = jerseyMap.get(jerseyId);
              if (!jersey) return null;
              return {
                jersey,
                score: jerseyScores.get(jerseyId),
                reason: 'collaborative_filtering'
              };
            })
            .filter(Boolean);
        }
      }
    }

    // Fallback: Popular jerseys (if no collaborative filtering results)
    if (recommendations.length === 0) {
      const interactedJerseyIds = interactions.map(i => i.jerseyId);
      
      const popularJerseys = await Jersey.find({
        _id: { $nin: interactedJerseyIds },
        inStock: true
      })
        .sort({ popularityScore: -1 })
        .limit(limit)
        .lean();

      recommendations = popularJerseys.map(j => ({
        jersey: j,
        score: j.popularityScore || 0,
        reason: 'popular'
      }));
    }

    // Cache results
    await setCache(cacheKey, recommendations);

    logger.info('Recommendations generated', {
      correlationId: req.correlationId,
      userId,
      count: recommendations.length,
      method: recommendations[0]?.reason || 'popular',
      interactionCount: interactions.length
    });

    res.json({
      success: true,
      data: recommendations,
      cached: false
    });
  } catch (error) {
    next(error);
  }
});

export default router;

