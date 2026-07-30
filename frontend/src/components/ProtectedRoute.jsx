import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading JobNest Portal...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const storedRole = localStorage.getItem('jobnest_user_role')?.toLowerCase();
  const currentRole = user?.role?.toLowerCase() || storedRole || '';

  if (requiredRole) {
    if (requiredRole === 'employer') {
      const isRecruiterUser = currentRole === 'employer' || currentRole === 'recruiter' || currentRole === 'admin' || storedRole === 'employer';
      if (!isRecruiterUser) {
        return <Navigate to="/jobs" replace />;
      }
    } else if (requiredRole === 'seeker') {
      if (currentRole === 'employer' || currentRole === 'recruiter' || currentRole === 'admin' || storedRole === 'employer') {
        return <Navigate to="/employer-dashboard" replace />;
      }
    }
  }

  return children;
};
