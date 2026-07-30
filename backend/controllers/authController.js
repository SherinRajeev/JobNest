import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { memoryStore } from '../config/store.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, avatar } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields including Phone Number' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = (role && (role.toLowerCase() === 'employer' || role.toLowerCase() === 'recruiter')) ? 'employer' : 'seeker';

    if (req.dbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        const existingRoleTitle = existingUser.role === 'employer' ? 'Recruiter' : 'Applicant';
        return res.status(400).json({
          message: `This account already exists as a ${existingRoleTitle}! Go and sign in.`
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: assignedRole,
        phone,
        location: location || 'Kottayam Town, Kerala',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      });

      return res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
          savedJobs: user.savedJobs
        },
        token: generateToken(user._id)
      });
    } else {
      // Memory Store Duplicate Check
      const existingInMemory = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existingInMemory) {
        const existingRoleTitle = existingInMemory.role === 'employer' ? 'Recruiter' : 'Applicant';
        return res.status(400).json({
          message: `This account already exists as a ${existingRoleTitle}! Go and sign in.`
        });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: normalizedEmail,
        password,
        role: assignedRole,
        phone,
        location: location || 'Kottayam Town, Kerala',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        savedJobs: []
      };

      memoryStore.users.push(newUser);

      return res.status(201).json({
        user: newUser,
        token: `mock_token_${Date.now()}`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const targetRole = (role && (role.toLowerCase() === 'employer' || role.toLowerCase() === 'recruiter')) ? 'employer' : null;

    if (req.dbConnected) {
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(404).json({ message: 'Account not found. Please register first!' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password. Please check your password.' });
      }

      if (targetRole && user.role !== targetRole) {
        user.role = targetRole;
        await user.save();
      }

      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          avatar: user.avatar,
          savedJobs: user.savedJobs
        },
        token: generateToken(user._id)
      });
    } else {
      let user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) {
        return res.status(404).json({ message: 'Account not found. Please register first!' });
      }

      if (user.password && user.password !== password) {
        return res.status(401).json({ message: 'Invalid password. Please check your password.' });
      }

      if (targetRole) {
        user.role = targetRole;
      }

      return res.json({
        user,
        token: `mock_token_${Date.now()}`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const user = await User.findById(userId).select('-password');
      if (user) return res.json(user);
    } else {
      const user = memoryStore.users.find(u => u._id === userId);
      if (user) return res.json(user);
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
