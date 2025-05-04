// Vercel-specific entry point for serverless deployment
import './server.js';

// Export a serverless function handler for Vercel
export default function handler(req, res) {
  // This function isn't directly used because the Express app handles all routes,
  // but Vercel expects an exported handler function
  res.status(404).send('Not found');
} 