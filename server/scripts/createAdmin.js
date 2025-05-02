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
      // Check if admin user already exists
      const adminExists = await User.findOne({ role: 'admin' });
      
      if (adminExists) {
        console.log('Admin user already exists:', adminExists.username);
        process.exit(0);
      }

      // Create admin user
      const admin = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin'
      });

      console.log('Admin user created successfully:', admin.username);
      
      // Exit process
      process.exit(0);
    } catch (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 