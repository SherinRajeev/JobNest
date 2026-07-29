import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogOut, PlusCircle, LayoutDashboard, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  const isRecruiter = user && ['employer', 'recruiter', 'admin'].includes(user.role?.toLowerCase());

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}>
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            flexShrink: 0
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Job<span className="gradient-text">Nest</span>
          </span>
        </Link>

        {/* Global Search Quick Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
            <Search size={16} /> Explore Nearby Shifts
          </Link>
        </div>

        {/* Auth & Navigation Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {isRecruiter ? (
                <>
                  <Link to="/post-job" className="btn btn-primary btn-sm">
                    <PlusCircle size={16} /> Post Shift
                  </Link>
                  <Link to="/employer-dashboard" className="btn btn-secondary btn-sm">
                    <LayoutDashboard size={16} /> Recruiter Portal
                  </Link>
                </>
              ) : (
                <Link to="/seeker-dashboard" className="btn btn-secondary btn-sm">
                  <LayoutDashboard size={16} /> My Applications
                </Link>
              )}

              {/* User Profile Capsule displaying "Applicant" or "Recruiter" */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.75rem', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: '30px' }}>
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', background: '#eff6ff', border: '1px solid var(--border-subtle)' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {isRecruiter ? 'Recruiter' : 'Applicant'}
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
              <Link to="/login" className="btn btn-secondary btn-sm">Applicant / Recruiter Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
