// Script to check MongoDB connection and database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jersey-recommendations';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Database name: ${dbName}`);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nCollections in database: ${collections.length}`);
    
    if (collections.length === 0) {
      console.log('⚠️  No collections found. Database is empty.');
      console.log('   Run: node scripts/add-sample-jerseys.js to add data');
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }

    // Count documents in each collection
    if (collections.length > 0) {
      console.log('\nDocument counts:');
      for (const col of collections) {
        const count = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`  ${col.name}: ${count} documents`);
      }
    }

    // Check if database exists
    const adminDb = mongoose.connection.db.admin();
    const databases = await adminDb.listDatabases();
    const dbExists = databases.databases.some(db => db.name === dbName);
    
    console.log(`\nDatabase "${dbName}" exists: ${dbExists ? '✅ Yes' : '❌ No'}`);
    console.log('\nNote: MongoDB creates databases when you first write to them.');
    console.log('If database is not showing in Compass, try:');
    console.log('1. Refresh Compass');
    console.log('2. Check connection string matches');
    console.log('3. Run: node scripts/add-sample-jerseys.js to create collections');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check MONGODB_URI in .env file');
    console.log('3. Default connection: mongodb://localhost:27017/jersey-recommendations');
    process.exit(1);
  }
}

checkDatabase();

