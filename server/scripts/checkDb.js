import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/User.js';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection string - use environment variable or fallback to a default
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

console.log('Connecting to MongoDB with URI:', MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // List all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:', collections.map(c => c.name));

      // Check if users collection exists
      if (collections.some(c => c.name === 'users')) {
        // Find all users
        const users = await User.find({});
        
        if (users.length > 0) {
          console.log(`Found ${users.length} users:`);
          users.forEach(user => {
            console.log(`- Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
          });
        } else {
          console.log('No users found in database');
          
          // Create admin user if no users exist
          console.log('Creating admin user...');
          const admin = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'Admin@123',
            role: 'admin'
          });
          
          console.log('Admin user created:');
          console.log(`- Username: ${admin.username}, Email: ${admin.email}, Role: ${admin.role}`);
        }
      } else {
        console.log('Users collection does not exist, will be created when adding first user');
        
        // Create admin user
        console.log('Creating admin user...');
        const admin = await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password: 'Admin@123',
          role: 'admin'
        });
        
        console.log('Admin user created:');
        console.log(`- Username: ${admin.username}, Email: ${admin.email}, Role: ${admin.role}`);
      }
      
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 