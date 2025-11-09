// Script to update jersey image URLs in MongoDB
// Usage: node scripts/update-jersey-images.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Jersey from '../models/Jersey.js';

dotenv.config();

// Update this object with your image URLs
// Format: { team: 'Team Name', imageUrl: 'your-image-url-here' }
const imageUpdates = [
  {
    team: 'Real Madrid',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'FC Barcelona',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Manchester United',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Liverpool FC',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Manchester City',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Paris Saint-Germain',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Bayern Munich',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Chelsea FC',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Arsenal FC',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  },
  {
    team: 'Juventus',
    imageUrl: 'YOUR_IMAGE_URL_HERE' // Replace with actual URL
  }
];

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jersey-recommendations');
    console.log('Connected to MongoDB\n');

    let updated = 0;
    let skipped = 0;

    for (const update of imageUpdates) {
      if (update.imageUrl === 'YOUR_IMAGE_URL_HERE') {
        console.log(`⏭️  Skipped ${update.team} - no URL provided`);
        skipped++;
        continue;
      }

      const result = await Jersey.updateMany(
        { team: update.team },
        { $set: { imageUrl: update.imageUrl } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${update.team}: ${result.modifiedCount} jersey(s)`);
        updated += result.modifiedCount;
      } else {
        console.log(`⚠️  No jerseys found for ${update.team}`);
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`   Updated: ${updated} jersey(s)`);
    console.log(`   Skipped: ${skipped} jersey(s)`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
}

updateImages();

