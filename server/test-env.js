const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the .env file in the current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('--- Environment Variable Test ---');
console.log('Current directory:', __dirname);
console.log('Attempting to load .env from:', path.resolve(__dirname, '.env'));
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check another variable too
console.log('---------------------------------');