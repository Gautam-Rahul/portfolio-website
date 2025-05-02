// Set environment variables directly
process.env.PORT = '5000';
process.env.MONGO_URI = 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = 'portfolio_app_secret_key';
process.env.NODE_ENV = 'development';

// Import and run the server
import('./server.js').catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 