// Set environment variables directly
process.env.PORT = '5000';
process.env.MONGO_URI = 'mongodb+srv://rahulbhumika99:crhxnkNmexCKdcJC@cluster0.rbufkhm.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = 'portfolio_app_secret_key';
process.env.NODE_ENV = 'development';

// First, set up required directories
import('./setupDirectories.js')
  .then(() => {
    console.log('Directories setup complete, starting server...');
    // Then import and run the server
    import('./server.js').catch(err => {
      console.error('Error starting server:', err);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('Error setting up directories:', err);
    process.exit(1);
  }); 