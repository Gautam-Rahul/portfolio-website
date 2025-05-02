import express from 'express';
import { 
  submitContact,
  getAllContacts,
  getContact,
  deleteContact,
  markAsRead,
  getUnreadCount
} from '../controllers/contactController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Admin-only routes
router.get('/', authenticate, isAdmin, getAllContacts);
router.get('/unread-count', authenticate, isAdmin, getUnreadCount);
router.get('/:id', authenticate, isAdmin, getContact);
router.put('/:id/read', authenticate, isAdmin, markAsRead);
router.delete('/:id', authenticate, isAdmin, deleteContact);

export default router; 