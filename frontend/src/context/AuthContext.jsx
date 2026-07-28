import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('jobnest_user');
    const storedToken = localStorage.getItem('jobnest_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('jobnest_user');
        localStorage.removeItem('jobnest_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('jobnest_user', JSON.stringify(data));
      localStorage.setItem('jobnest_token', data.token);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const { data } = await API.post('/auth/register', formData);
      setUser(data);
      localStorage.setItem('jobnest_user', JSON.stringify(data));
      localStorage.setItem('jobnest_token', data.token);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobnest_user');
    localStorage.removeItem('jobnest_token');
  };

  const updateUserSavedJobs = (savedJobs) => {
    if (user) {
      const updated = { ...user, savedJobs };
      setUser(updated);
      localStorage.setItem('jobnest_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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
