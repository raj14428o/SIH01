import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes that require a user to be logged in
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user (without passwordHash) to req.user
      req.user = await User.findById(decoded.userId).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

// Middleware to check for admin role
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Not authorized as an admin' });
  }
};
