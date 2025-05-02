import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Resume from '../models/Resume.js';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (directly set because we know .env has issues)
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

console.log('Connecting to MongoDB with URI:', MONGO_URI.substring(0, 20) + '...');

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Deactivate any existing active resumes
      await Resume.updateMany({}, { isActive: false });
      console.log('Deactivated any existing resumes');
      
      // Create resume with the specific filename from the error
      const filename = 'resume-1746197083946-189282492.pdf';
      
      // First check if this resume already exists
      const existingResume = await Resume.findOne({ filename });
      
      if (existingResume) {
        console.log('Resume with this filename already exists, activating it');
        existingResume.isActive = true;
        await existingResume.save();
        console.log('Resume activated:', existingResume);
      } else {
        // Create new resume with the filename from the error
        const resume = await Resume.create({
          filename,
          path: `/uploads/resume/${filename}`,
          isActive: true
        });
        
        console.log('New resume created with filename:', filename);
        console.log('Resume document:', resume);
      }
      
      // Copy the sample resume to match the expected filename
      const fs = await import('fs');
      
      const sourcePath = path.join(__dirname, '..', 'uploads', 'resume', 'sample-resume.pdf');
      const targetPath = path.join(__dirname, '..', 'uploads', 'resume', filename);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log('Created resume file with correct filename');
      } else {
        console.error('Source sample resume not found');
      }
      
      console.log('Done!');
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