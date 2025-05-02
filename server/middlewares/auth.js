import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to check if user is authenticated
export const authenticate = async (req, res, next) => {
  try {
    // Get token from various sources with better error handling
    let token;
    
    // Check Authorization header (Bearer token)
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
      console.log('Found token in Authorization header');
    }
    
    // If no token in header, check cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Found token in cookies');
    }
    
    // Final check for custom header
    if (!token && req.header('x-auth-token')) {
      token = req.header('x-auth-token');
      console.log('Found token in x-auth-token header');
    }
    
    if (!token) {
      console.log('No authentication token found in request');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. No token provided.' 
      });
    }

    console.log('Verifying token...');
    try {
      // Use the same fallback as in authController
      const jwtSecret = process.env.JWT_SECRET || 'portfolio_app_secret_key';
      const decoded = jwt.verify(token, jwtSecret);
      console.log('Token verified for user ID:', decoded.id);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(404).json({ 
          success: false, 
          message: 'User not found.' 
        });
      }
      
      console.log('User authenticated:', user.username);
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Authentication failed.',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.',
      error: error.message 
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

// Middleware to check if user is admin or owner
export const isAdminOrOwner = (req, res, next) => {
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges or ownership required.' 
    });
  }
}; 