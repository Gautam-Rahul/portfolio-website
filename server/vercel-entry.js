// Vercel-specific entry point for serverless deployment
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

// Initialize environment variables
dotenv.config();
process.env.PORT = process.env.PORT || '5000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'portfolio_app_secret_key';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Setup for __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// List of allowed origins for CORS
const allowedOrigins = [
  'https://portfolio-website-theta-ten-47.vercel.app',
  'https://www.rahulgtm.com',
  'https://rahulgtm.com',
  'https://www.rahulgtm.com/#',
  'https://www.rahulgtm.com/#/',
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
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed)) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS pre-flight handling
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
    cors: 'CORS configuration is correctly set up',
    timestamp: new Date().toISOString()
  });
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

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app as a serverless function for Vercel
export default app; 