// Simple test server for CORS verification
import express from 'express';
import cors from 'cors';

const app = express();

// Use completely permissive CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add CORS preflight handling
app.options('*', cors());

// Routes
app.get('/', (req, res) => {
  res.send('Test server is running...');
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
    cors: 'CORS configuration is correctly set up',
    timestamp: new Date().toISOString()
  });
});

// Resume test endpoint
app.get('/api/resume/active', (req, res) => {
  res.status(200).json({
    success: true,
    resume: {
      _id: 'test-resume-id',
      filename: 'test-resume.pdf',
      path: '/uploads/resume/test-resume.pdf',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

// Start server if not in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app; 