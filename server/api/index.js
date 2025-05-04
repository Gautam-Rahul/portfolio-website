// API index handler
export default function handler(req, res) {
  res.json({
    message: 'Portfolio API is running',
    endpoints: [
      { path: '/api/auth', desc: 'Authentication endpoints' },
      { path: '/api/resume', desc: 'Resume data endpoints' },
      { path: '/api/projects', desc: 'Projects data endpoints' },
      { path: '/api/contact', desc: 'Contact form endpoints' },
      { path: '/api/uploads', desc: 'File uploads endpoints' }
    ]
  });
} 