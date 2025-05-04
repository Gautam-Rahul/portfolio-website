import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Setup for __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

export default function handler(req, res) {
  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).send('Filename is required');
  }
  
  // Prevent path traversal attacks
  const safePath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(uploadsDir, safePath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  
  // Determine content type
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream';
  
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.pdf') contentType = 'application/pdf';
  
  // Set headers
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
} 