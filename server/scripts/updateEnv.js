import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the MongoDB Atlas connection string
const mongoUri = 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

// Create .env file content
const envContent = `PORT=5000
MONGO_URI=${mongoUri}
JWT_SECRET=portfolio_app_secret_key
NODE_ENV=development`;

// Write to .env file
const envPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(envPath, envContent);

console.log('Updated .env file with MongoDB Atlas connection string.');
console.log('MongoDB URI:', mongoUri); 