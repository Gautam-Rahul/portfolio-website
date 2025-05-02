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
      // Check if admin user exists
      const admin = await User.findOne({ email: 'admin@example.com' });
      
      if (admin) {
        console.log('Admin user found:');
        console.log('- Username:', admin.username);
        console.log('- Email:', admin.email);
        console.log('- Role:', admin.role);
        
        // Create a new admin if needed
        if (admin.role !== 'admin') {
          admin.role = 'admin';
          await admin.save();
          console.log('Updated user role to admin');
        }
      } else {
        console.log('No admin user found. Creating one...');
        
        // Create admin user
        const newAdmin = await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password: 'Admin@123',
          role: 'admin'
        });
        
        console.log('New admin user created:');
        console.log('- Username:', newAdmin.username);
        console.log('- Email:', newAdmin.email);
        console.log('- Role:', newAdmin.role);
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