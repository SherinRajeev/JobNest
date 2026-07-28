import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, LogOut, PlusCircle, LayoutDashboard, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <Compass size={22} color="#ffffff" />
          </div>
          <span>Job<span className="gradient-text">Nest</span></span>
        </Link>

        {/* Global Search Bar Quick Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
            <Search size={16} /> Explore Nearby Shifts
          </Link>
        </div>

        {/* Auth & Navigation Actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {user.role === 'employer' ? (
                <>
                  <Link to="/post-job" className="btn btn-primary btn-sm">
                    <PlusCircle size={16} /> Post New Shift
                  </Link>
                  <Link to="/employer-dashboard" className="btn btn-secondary btn-sm">
                    <LayoutDashboard size={16} /> Admin Portal
                  </Link>
                </>
              ) : (
                <Link to="/seeker-dashboard" className="btn btn-secondary btn-sm">
                  <LayoutDashboard size={16} /> My Applications
                </Link>
              )}

              {/* User Profile Capsule */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.75rem', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '30px' }}>
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', background: '#eff6ff' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user.role === 'employer' ? 'Admin' : 'Applicant'}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
