import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Jersey from '../models/Jersey.js';
import User from '../models/User.js';
import Interaction from '../models/Interaction.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const sampleJerseys = [
  {
    team: 'Real Madrid',
    player: 'Cristiano Ronaldo',
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    price: 99.99,
    description: 'Official Real Madrid home jersey',
    popularityScore: 60,
    inStock: true,
    stockCount: 100
  },
  {
    team: 'FC Barcelona',
    player: 'Lionel Messi',
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    price: 95.99,
    description: 'Official FC Barcelona home jersey',
    popularityScore: 58,
    inStock: true,
    stockCount: 90
  },
  {
    team: 'Manchester United',
    player: 'Wayne Rooney',
    category: 'retro',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    price: 129.99,
    description: 'Classic Manchester United retro jersey',
    popularityScore: 55,
    inStock: true,
    stockCount: 50
  },
  {
    team: 'Liverpool FC',
    player: 'Mohamed Salah',
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    price: 89.99,
    description: 'Official Liverpool FC home jersey',
    popularityScore: 52,
    inStock: true,
    stockCount: 85
  },
  {
    team: 'Manchester City',
    player: 'Erling Haaland',
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    price: 94.99,
    description: 'Official Manchester City home jersey',
    popularityScore: 50,
    inStock: true,
    stockCount: 75
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jersey-recommendations');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Jersey.deleteMany({});
    await User.deleteMany({});
    await Interaction.deleteMany({});
    console.log('Cleared existing data');

    // Create sample jerseys
    const jerseys = await Jersey.insertMany(sampleJerseys);
    console.log(`Created ${jerseys.length} jerseys`);

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: hashedPassword
    });
    console.log('Created test user:', user.email);

    // Create some sample interactions
    const interactions = [];
    for (let i = 0; i < 3; i++) {
      interactions.push({
        userId: user._id,
        jerseyId: jerseys[i]._id,
        type: i === 0 ? 'purchase' : i === 1 ? 'cart' : 'view',
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // Spread over 3 days
      });
    }
    await Interaction.insertMany(interactions);
    console.log(`Created ${interactions.length} interactions`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

