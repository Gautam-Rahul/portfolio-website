import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Resume from '../models/Resume.js';

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
      // Check if resume already exists
      const resumeExists = await Resume.findOne({ isActive: true });
      
      if (resumeExists) {
        console.log('Active resume already exists:', resumeExists.filename);
        process.exit(0);
      }

      // Create resume entry
      const resume = await Resume.create({
        filename: 'sample-resume.pdf',
        path: '/uploads/resume/sample-resume.pdf',
        isActive: true
      });

      console.log('Resume entry created successfully:', resume.filename);
      
      // Exit process
      process.exit(0);
    } catch (error) {
      console.error('Error creating resume entry:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 