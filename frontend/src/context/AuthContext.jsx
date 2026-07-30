import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const [userDatabase, setUserDatabase] = useState(() => {
    const stored = localStorage.getItem('jobnest_users_db');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        _id: 'usr_seeker_1',
        name: 'Rohan Sharma',
        email: 'seeker@jobnest.com',
        password: 'password123',
        role: 'seeker',
        phone: '+91 98765 43210',
        location: 'Kottayam Town, Kerala',
        bio: 'College student looking for flexible weekend & evening part-time shifts.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        savedJobs: ['job_1', 'job_3']
      },
      {
        _id: 'usr_employer_1',
        name: 'Priya Nair',
        email: 'employer@jobnest.com',
        password: 'password123',
        role: 'employer',
        phone: '+91 91234 56789',
        location: 'Kanjikuzhy, Kottayam',
        bio: 'Recruiter at Local Business & Retail Networks in Kerala.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        savedJobs: []
      }
    ];
  });

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          let parsed = JSON.parse(storedUser);
          const overrideRole = localStorage.getItem('jobnest_user_role');
          if (overrideRole === 'employer') {
            parsed.role = 'employer';
          }
          setUser(parsed);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }

      if (storedToken) {
        try {
          const { data } = await API.get('/auth/me');
          const overrideRole = localStorage.getItem('jobnest_user_role');
          let u = { ...data };
          if (overrideRole === 'employer') u.role = 'employer';
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        } catch (err) {
          console.warn('Backend offline, using stored local session profile');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password, selectedRole) => {
    const normEmail = email.toLowerCase().trim();
    const isRecruiter = selectedRole === 'employer' || selectedRole === 'recruiter';
    const targetRole = isRecruiter ? 'employer' : 'seeker';

    if (isRecruiter) {
      localStorage.setItem('jobnest_user_role', 'employer');
    } else {
      localStorage.setItem('jobnest_user_role', 'seeker');
    }

    try {
      const { data } = await API.post('/auth/login', { email: normEmail, password, role: targetRole });
      let authUser = { ...data.user, role: targetRole };
      setToken(data.token);
      setUser(authUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(authUser));
      return authUser;
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg && !serverMsg.includes('Invalid email') && !serverMsg.includes('password')) {
        throw new Error(serverMsg);
      }

      // Local Verification
      const found = userDatabase.find(u => u.email.toLowerCase() === normEmail);
      if (!found) {
        throw new Error('Account not found. Please register first!');
      }

      if (found.password && found.password !== password) {
        throw new Error('Invalid password. Please check your password.');
      }

      let authUser = { ...found, role: targetRole };

      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(authUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(authUser));

      const updatedDb = userDatabase.map(u => u.email.toLowerCase() === normEmail ? { ...u, role: targetRole } : u);
      setUserDatabase(updatedDb);
      localStorage.setItem('jobnest_users_db', JSON.stringify(updatedDb));

      return authUser;
    }
  };

  const register = async (name, email, password, role, phone, location, customAvatar) => {
    const normEmail = email.toLowerCase().trim();

    const existing = userDatabase.find(u => u.email.toLowerCase() === normEmail);
    if (existing) {
      const existingRoleTitle = existing.role === 'employer' ? 'Recruiter' : 'Applicant';
      throw new Error(`This account already exists as a ${existingRoleTitle}! Go and sign in.`);
    }

    const selectedAvatar = customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}`;
    const assignedRole = (role === 'employer' || role === 'recruiter') ? 'employer' : 'seeker';

    if (assignedRole === 'employer') {
      localStorage.setItem('jobnest_user_role', 'employer');
    } else {
      localStorage.setItem('jobnest_user_role', 'seeker');
    }

    try {
      const { data } = await API.post('/auth/register', { name, email: normEmail, password, role: assignedRole, phone, location, avatar: selectedAvatar });
      let authUser = { ...data.user, role: assignedRole };
      setToken(data.token);
      setUser(authUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(authUser));

      const updatedDb = [{ ...authUser, password }, ...userDatabase];
      setUserDatabase(updatedDb);
      localStorage.setItem('jobnest_users_db', JSON.stringify(updatedDb));

      return authUser;
    } catch (err) {
      const serverErrorMsg = err.response?.data?.message;
      if (serverErrorMsg && serverErrorMsg.includes('already exists')) {
        throw new Error(serverErrorMsg);
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name: name || 'New User',
        email: normEmail,
        password,
        role: assignedRole,
        phone: phone || '+91 98765 43210',
        location: location || 'Kottayam Town, Kerala',
        bio: assignedRole === 'employer' ? 'Recruiter at Local Business Network' : 'JobNest Registered Applicant',
        avatar: selectedAvatar,
        savedJobs: []
      };

      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(newUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      const updatedDb = [newUser, ...userDatabase];
      setUserDatabase(updatedDb);
      localStorage.setItem('jobnest_users_db', JSON.stringify(updatedDb));

      return newUser;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('jobnest_user_role');
  };

  const updateUserSavedJobs = (savedJobs) => {
    if (user) {
      const updated = { ...user, savedJobs };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        updateUserSavedJobs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
