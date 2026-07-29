import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading JobNest Portal...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const userRole = user.role?.toLowerCase() || '';
    if (requiredRole === 'employer') {
      const isRecruiterUser = ['employer', 'recruiter', 'admin'].includes(userRole);
      if (!isRecruiterUser) {
        return <Navigate to="/jobs" replace />;
      }
    } else if (requiredRole === 'seeker') {
      if (userRole === 'employer' || userRole === 'recruiter' || userRole === 'admin') {
        return <Navigate to="/employer-dashboard" replace />;
      }
    }
  }

  return children;
};
