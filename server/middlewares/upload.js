import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configure resume storage
const resumeStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(rootDir, 'uploads/resume'));
  },
  filename: function(req, file, cb) {
    // Get file extension
    const ext = path.extname(file.originalname);
    // Create unique filename: timestamp + random string + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});

// Resume file filter: only accept PDFs
const resumeFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume uploads'), false);
  }
};

// Configure project image storage
const projectImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(rootDir, 'uploads/projects'));
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

// Project image filter: only accept images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and WebP images are allowed for project uploads'), false);
  }
};

// Create upload middleware
export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
  fileFilter: resumeFilter
});

export const uploadProjectImage = multer({
  storage: projectImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max size
  fileFilter: imageFilter
}); 