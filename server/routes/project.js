import express from 'express';
import { 
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { uploadProjectImage } from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Admin-only routes
router.post('/', authenticate, isAdmin, uploadProjectImage.single('image'), createProject);
router.put('/:id', authenticate, isAdmin, uploadProjectImage.single('image'), updateProject);
router.delete('/:id', authenticate, isAdmin, deleteProject);

export default router; 