// Direct environment variable setup (ensure these are set regardless of .env loading)
process.env.PORT = process.env.PORT || '5000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'portfolio_app_secret_key';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import projectRoutes from './routes/project.js';
import contactRoutes from './routes/contact.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of allowed origins for CORS
const allowedOrigins = [
  'https://portfolio-website-theta-ten-47.vercel.app',
  'https://gautam-rahul.github.io',
  'https://gautam-rahul.github.io/portfolio-website',
  'http://localhost:5173',
  'http://localhost:5174'
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
}); 