import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserCheck, Briefcase, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const u = await login(email, password);
      if (u.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSeeker = async () => {
    setEmail('seeker@jobnest.com');
    setPassword('password123');
    setLoading(true);
    setError(null);
    try {
      await login('seeker@jobnest.com', 'password123');
      navigate('/jobs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoEmployer = async () => {
    setEmail('employer@jobnest.com');
    setPassword('password123');
    setLoading(true);
    setError(null);
    try {
      await login('employer@jobnest.com', 'password123');
      navigate('/employer-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3.5rem', maxWidth: '460px' }}>
      <div className="card-glass" style={{ padding: '2.25rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back to <span className="gradient-text">JobNest</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Sign in to manage applications or broadcast part-time shifts.
        </p>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        {/* Instant Demo Login Buttons */}
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Instant Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button type="button" onClick={handleDemoSeeker} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
              <UserCheck size={14} color="var(--primary)" /> Demo Seeker
            </button>
            <button type="button" onClick={handleDemoEmployer} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
              <Briefcase size={14} color="var(--amber)" /> Demo Employer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : <>Sign In <LogIn size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};
