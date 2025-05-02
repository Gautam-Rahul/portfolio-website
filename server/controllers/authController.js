import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  console.log('Generating token for ID:', id);
  
  // Check if JWT_SECRET exists, use a fallback if it doesn't
  const jwtSecret = process.env.JWT_SECRET || 'portfolio_app_secret_key';
  console.log('JWT_SECRET present:', !!jwtSecret);
  console.log('JWT_SECRET value:', jwtSecret ? jwtSecret.substring(0, 3) + '...' : 'undefined');
  
  const token = jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d' // Token valid for 30 days
  });
  
  console.log('Generated token (first 20 chars):', token.substring(0, 20) + '...');
  return token;
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      // Send response with token
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Request body:', req.body);

    // Check if both email and password are provided
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed: User not found with email', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Found user:', JSON.stringify({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      passwordLength: user.password ? user.password.length : 0
    }));

    // Check if password matches
    try {
      const isMatch = await user.comparePassword(password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Login failed: Invalid password for', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } catch (passwordError) {
      console.error('Error comparing passwords:', passwordError);
      return res.status(500).json({
        success: false,
        message: 'Error verifying credentials',
        error: passwordError.message
      });
    }

    // Generate token
    try {
      const token = generateToken(user._id);
      console.log('Login successful for user:', user.username);
      
      // Optional: Set cookie with token (for browser-based sessions)
      // This is now a backup mechanism, as the primary auth will be via Authorization header
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
  
      // Always send token in the response for client-side storage
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token',
        error: tokenError.message
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Logout user
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 