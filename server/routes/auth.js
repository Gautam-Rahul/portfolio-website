import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Register new user (admin protected)
router.post('/register', authenticate, isAdmin, register);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

// Get current user
router.get('/me', authenticate, getCurrentUser);

export default router; 