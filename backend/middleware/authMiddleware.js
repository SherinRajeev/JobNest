import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jobnest_secret_key_2026');
      
      // If MongoDB is connected, load user from DB; else pass decoded object
      if (req.dbConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = decoded;
      }
      
      if (!req.user) {
        return res.status(401).json({ message: 'User authorization failed' });
      }

      return next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Employer role required' });
  }
};
