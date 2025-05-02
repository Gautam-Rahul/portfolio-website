import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection string - use environment variable or fallback to a default
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// Test credentials
const testEmail = 'admin@example.com';
const testPassword = 'Admin@123';

console.log('Connecting to MongoDB with URI:', MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Find admin user
      const admin = await User.findOne({ email: testEmail });
      
      if (!admin) {
        console.log('Admin user not found! Creating a new one...');
        
        // Create new admin with known password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        
        const newAdmin = await User.create({
          username: 'admin',
          email: testEmail,
          password: hashedPassword,
          role: 'admin'
        });
        
        console.log('New admin created with known password');
        process.exit(0);
      }
      
      // Test password comparison manually
      console.log('Admin user found, testing password...');
      
      // Direct password comparison for debugging
      const passwordMatches = await bcrypt.compare(testPassword, admin.password);
      console.log('Password match result:', passwordMatches);
      
      if (!passwordMatches) {
        console.log('Password does not match! Resetting password...');
        
        // Reset password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(testPassword, salt);
        await admin.save();
        
        console.log('Admin password has been reset');
      } else {
        console.log('Password is correct! You should be able to log in with these credentials.');
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