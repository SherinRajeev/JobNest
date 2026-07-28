import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, MapPin, PlusCircle, User, LogOut, Search, Compass, BookMarked } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-wrapper">
        <Link to="/" className="logo-brand">
          <div className="logo-icon">
            <Compass size={24} />
          </div>
          <span>Job<span className="gradient-text">Nest</span></span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/jobs" className={`nav-link ${location.pathname === '/jobs' ? 'active' : ''}`}>
              <Search size={18} /> Find Nearby Jobs
            </Link>
          </li>
          {user && user.role === 'seeker' && (
            <li>
              <Link to="/seeker-dashboard" className={`nav-link ${location.pathname === '/seeker-dashboard' ? 'active' : ''}`}>
                <BookMarked size={18} /> My Applications
              </Link>
            </li>
          )}
          {user && user.role === 'employer' && (
            <>
              <li>
                <Link to="/employer-dashboard" className={`nav-link ${location.pathname === '/employer-dashboard' ? 'active' : ''}`}>
                  <Briefcase size={18} /> Hiring Portal
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="btn btn-primary btn-sm">
                  <PlusCircle size={16} /> Post Part-Time Shift
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-user">
          {user ? (
            <div className="user-badge">
              <img src={user.avatar} alt={user.name} className="avatar-sm" />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', marginLeft: '0.5rem' }} title="Logout">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
