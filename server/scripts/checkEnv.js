import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt to load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Define required environment variables
const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
console.log('Checking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file exists');
  
  // Read and display the file content
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n.env file content:');
  console.log('----------------------');
  console.log(envContent);
  console.log('----------------------\n');
} else {
  console.log('.env file does not exist - will create one');
  
  // Create a basic .env file
  const defaultEnv = `PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=portfolio_app_secret_key
NODE_ENV=development`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('Created new .env file with default values');
  
  // Reload environment variables
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

// Check if all required variables are set
console.log('\nEnvironment variables check:');
let allVarsSet = true;

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    // For sensitive values, only show first few characters
    const value = varName === 'JWT_SECRET' 
      ? `${process.env[varName].substring(0, 3)}...` 
      : process.env[varName];
    
    console.log(`✅ ${varName} is set to: ${value}`);
  } else {
    console.log(`❌ ${varName} is not set`);
    allVarsSet = false;
  }
});

if (!allVarsSet) {
  console.log('\nSome required environment variables are missing.');
  console.log('Please check your .env file and update it with the missing values.');
} else {
  console.log('\nAll required environment variables are set correctly.');
}

// Print out process.env to verify variables are actually loaded
console.log('\nProcess environment variables:');
console.log('JWT_SECRET exists in process.env:', 'JWT_SECRET' in process.env);
console.log('JWT_SECRET value:', process.env.JWT_SECRET ? `${process.env.JWT_SECRET.substring(0, 3)}...` : 'undefined'); 