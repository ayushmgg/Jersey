import mongoose from 'mongoose';

const jerseySchema = new mongoose.Schema({
  team: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    index: true
  },
  player: {
    type: String,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['home', 'away', 'alternate', 'retro', 'special'],
    index: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  popularityScore: {
    type: Number,
    default: 0,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for common queries
jerseySchema.index({ team: 1, category: 1 });
jerseySchema.index({ popularityScore: -1 });

export default mongoose.model('Jersey', jerseySchema);

