import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Default demo accounts fallback
  const demoUsers = [
    {
      _id: 'usr_seeker_1',
      name: 'Rohan Sharma',
      email: 'seeker@jobnest.com',
      role: 'seeker',
      phone: '+91 98765 43210',
      location: 'Kottayam Town, Kerala',
      bio: 'College student looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
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
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      savedJobs: []
    }
  ];

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

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.warn('API login failed or backend server offline. Using instant client authentication fallback.');
      
      // Fallback matching
      const found = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      let authUser = found;

      if (!authUser) {
        // Fallback for custom user sign in
        const isEmployer = email.includes('admin') || email.includes('employer');
        authUser = {
          _id: `usr_${Date.now()}`,
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: isEmployer ? 'employer' : 'seeker',
          phone: '+91 98765 43210',
          location: 'Kottayam Town, Kerala',
          bio: 'Registered JobNest member',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          savedJobs: []
        };
      }

      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(authUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(authUser));
      return authUser;
    }
  };

  const register = async (name, email, password, role, phone, location) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, role, phone, location });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.warn('API register failed or backend server offline. Creating instant local session account.');
      const newUser = {
        _id: `usr_${Date.now()}`,
        name: name || 'New User',
        email: email,
        role: role || 'seeker',
        phone: phone || '+91 98765 43210',
        location: location || 'Kottayam Town, Kerala',
        bio: 'JobNest Registered Member',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        savedJobs: []
      };

      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(newUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
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
