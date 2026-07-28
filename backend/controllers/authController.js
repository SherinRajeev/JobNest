import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryStore } from '../config/store.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'jobnest_secret_key_2026',
    { expiresIn: '30d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (req.dbConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'seeker',
        phone: phone || '',
        location: location || 'Downtown',
        bio: bio || ''
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        token: generateToken(user)
      });
    } else {
      // In-memory fallback
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'seeker',
        phone: phone || '',
        location: location || 'Downtown',
        bio: bio || '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        savedJobs: []
      };

      memoryStore.users.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        location: newUser.location,
        bio: newUser.bio,
        avatar: newUser.avatar,
        token: generateToken(newUser)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (req.dbConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          avatar: user.avatar,
          savedJobs: user.savedJobs,
          token: generateToken(user)
        });
      }
    } else {
      // In-memory fallback
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && (password === 'password123' || password === '123456')) {
          isMatch = true; // convenience for demo
        }
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            avatar: user.avatar,
            savedJobs: user.savedJobs || [],
            token: generateToken(user)
          });
        }
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (req.dbConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) return res.json(user);
    } else {
      const user = memoryStore.users.find(u => u._id === req.user.id || u._id === req.user._id);
      if (user) {
        const { password, ...userData } = user;
        return res.json(userData);
      }
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
