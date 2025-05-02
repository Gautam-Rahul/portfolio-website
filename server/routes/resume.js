import express from 'express';
import { 
  uploadResume as uploadResumeController,
  getActiveResume,
  getAllResumes,
  activateResume,
  deleteResume
} from '../controllers/resumeController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { uploadResume } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveResume);

// Admin-only routes
router.post('/upload', authenticate, isAdmin, uploadResume.single('resume'), uploadResumeController);
router.get('/all', authenticate, isAdmin, getAllResumes);
router.put('/activate/:id', authenticate, isAdmin, activateResume);
router.delete('/:id', authenticate, isAdmin, deleteResume);

export default router; 