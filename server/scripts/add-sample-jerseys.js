import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Jersey from '../models/Jersey.js';

dotenv.config();

// INSTRUCTIONS: Replace the imageUrl with your own jersey image URLs
// You can use:
// 1. URLs from image hosting services (Imgur, Cloudinary, etc.)
// 2. Local file paths (if serving images from your server)
// 3. URLs from jersey websites
// 4. Base64 encoded images (for small images)

const sampleJerseys = [
  {
    team: 'Real Madrid',
    player: 'Cristiano Ronaldo',
    category: 'home',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Real Madrid jersey image URL
    price: 99.99,
    description: 'Official Real Madrid home jersey with Cristiano Ronaldo',
    popularityScore: 60,
    inStock: true,
    stockCount: 100
  },
  {
    team: 'FC Barcelona',
    player: 'Lionel Messi',
    category: 'home',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual FC Barcelona jersey image URL
    price: 95.99,
    description: 'Official FC Barcelona home jersey with Lionel Messi',
    popularityScore: 58,
    inStock: true,
    stockCount: 90
  },
  {
    team: 'Manchester United',
    player: 'Wayne Rooney',
    category: 'retro',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Manchester United jersey image URL
    price: 129.99,
    description: 'Classic Manchester United retro jersey with Wayne Rooney',
    popularityScore: 55,
    inStock: true,
    stockCount: 50
  },
  {
    team: 'Liverpool FC',
    player: 'Mohamed Salah',
    category: 'home',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Liverpool FC jersey image URL
    price: 89.99,
    description: 'Official Liverpool FC home jersey with Mohamed Salah',
    popularityScore: 52,
    inStock: true,
    stockCount: 85
  },
  {
    team: 'Manchester City',
    player: 'Erling Haaland',
    category: 'home',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Manchester City jersey image URL
    price: 94.99,
    description: 'Official Manchester City home jersey with Erling Haaland',
    popularityScore: 50,
    inStock: true,
    stockCount: 75
  },
  {
    team: 'Paris Saint-Germain',
    player: 'Kylian Mbappé',
    category: 'home',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual PSG jersey image URL
    price: 97.99,
    description: 'Official Paris Saint-Germain home jersey with Kylian Mbappé',
    popularityScore: 48,
    inStock: true,
    stockCount: 80
  },
  {
    team: 'Bayern Munich',
    player: 'Robert Lewandowski',
    category: 'away',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Bayern Munich jersey image URL
    price: 92.99,
    description: 'Official Bayern Munich away jersey with Robert Lewandowski',
    popularityScore: 46,
    inStock: true,
    stockCount: 70
  },
  {
    team: 'Chelsea FC',
    player: 'Frank Lampard',
    category: 'retro',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Chelsea FC jersey image URL
    price: 119.99,
    description: 'Classic Chelsea FC retro jersey with Frank Lampard',
    popularityScore: 44,
    inStock: true,
    stockCount: 60
  },
  {
    team: 'Arsenal FC',
    player: 'Thierry Henry',
    category: 'retro',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Arsenal FC jersey image URL
    price: 124.99,
    description: 'Classic Arsenal FC retro jersey with Thierry Henry',
    popularityScore: 42,
    inStock: true,
    stockCount: 55
  },
  {
    team: 'Juventus',
    player: 'Cristiano Ronaldo',
    category: 'away',
    imageUrl: 'YOUR_IMAGE_URL_HERE', // Replace with actual Juventus jersey image URL
    price: 91.99,
    description: 'Official Juventus away jersey with Cristiano Ronaldo',
    popularityScore: 40,
    inStock: true,
    stockCount: 65
  }
];

async function addJerseys() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jersey-recommendations');
    console.log('Connected to MongoDB');

    // Clear existing jerseys (optional - remove if you want to keep existing)
    // await Jersey.deleteMany({});
    // console.log('Cleared existing jerseys');

    // Add sample jerseys
    const existingCount = await Jersey.countDocuments();
    console.log(`Current jerseys in database: ${existingCount}`);

    const newJerseys = await Jersey.insertMany(sampleJerseys);
    console.log(`✅ Successfully added ${newJerseys.length} jerseys!`);
    console.log('\nJerseys added:');
    newJerseys.forEach(j => {
      console.log(`  - ${j.team} (${j.player}) - $${j.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error adding jerseys:', error);
    process.exit(1);
  }
}

addJerseys();

