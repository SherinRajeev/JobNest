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
        role: 'employer',
        phone: '+91 91234 56789',
        location: 'Kanjikuzhy, Kottayam',
        bio: 'Recruiter at Local Business & Retail Networks in Kerala.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        savedJobs: []
      }
    ];
  });

  const [registeredEmails, setRegisteredEmails] = useState(() => {
    const stored = localStorage.getItem('jobnest_registered_emails');
    return stored ? JSON.parse(stored) : ['seeker@jobnest.com', 'employer@jobnest.com'];
  });

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }

      if (storedToken) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
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
    const targetRole = selectedRole === 'employer' || selectedRole === 'recruiter' ? 'employer' : 'seeker';

    try {
      const { data } = await API.post('/auth/login', { email: normEmail, password, role: targetRole });
      let authUser = data.user;
      if (selectedRole === 'employer' && authUser.role !== 'employer') {
        authUser.role = 'employer';
      }
      setToken(data.token);
      setUser(authUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(authUser));
      return authUser;
    } catch (err) {
      console.warn('API login fallback proceeding.');
      
      const found = userDatabase.find(u => u.email.toLowerCase() === normEmail);
      let authUser = found ? { ...found } : null;

      if (!authUser) {
        const seedName = normEmail.split('@')[0];
        authUser = {
          _id: `usr_${Date.now()}`,
          name: seedName.toUpperCase(),
          email: normEmail,
          role: targetRole,
          phone: '+91 98765 43210',
          location: 'Kottayam Town, Kerala',
          bio: targetRole === 'employer' ? 'Recruiter Account' : 'Applicant Account',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seedName)}`,
          savedJobs: []
        };
      } else if (selectedRole === 'employer') {
        authUser.role = 'employer';
      }

      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(authUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(authUser));
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
    const assignedRole = role === 'employer' || role === 'recruiter' ? 'employer' : 'seeker';

    try {
      const { data } = await API.post('/auth/register', { name, email: normEmail, password, role: assignedRole, phone, location, avatar: selectedAvatar });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const updatedDb = [data.user, ...userDatabase];
      setUserDatabase(updatedDb);
      localStorage.setItem('jobnest_users_db', JSON.stringify(updatedDb));

      return data.user;
    } catch (err) {
      const serverErrorMsg = err.response?.data?.message;
      if (serverErrorMsg && serverErrorMsg.includes('already exists')) {
        throw new Error(serverErrorMsg);
      }

      console.warn('API register fallback proceeding.');
      const newUser = {
        _id: `usr_${Date.now()}`,
        name: name || 'New User',
        email: normEmail,
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
