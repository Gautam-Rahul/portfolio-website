import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to create
const directories = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/projects'),
  path.join(__dirname, 'uploads/resume')
];

// Create directories if they don't exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('All directories created successfully!'); 