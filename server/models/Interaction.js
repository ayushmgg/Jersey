import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jerseyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jersey',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['view', 'cart', 'purchase'],
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    duration: Number, // for views
    quantity: Number  // for purchases
  }
}, {
  timestamps: true
});

// Compound indexes for recommendation queries
interactionSchema.index({ userId: 1, type: 1, timestamp: -1 });
interactionSchema.index({ jerseyId: 1, type: 1 });

export default mongoose.model('Interaction', interactionSchema);

