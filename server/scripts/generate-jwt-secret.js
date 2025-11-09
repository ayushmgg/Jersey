// Generate a strong JWT secret key
const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\n✅ Generated JWT Secret:');
console.log(jwtSecret);
console.log('\n📝 Add this to your .env file:');
console.log(`JWT_SECRET=${jwtSecret}\n`);


