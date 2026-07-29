import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff, User, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('seeker'); // 'seeker' (Applicant) or 'employer' (Recruiter)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const u = await login(email, password);
      const isRecruiterUser = u && ['employer', 'recruiter', 'admin'].includes(u.role?.toLowerCase());

      // Validate selected login tab vs account role
      if (role === 'employer' && !isRecruiterUser) {
        // User picked Recruiter tab but account is Applicant
        u.role = 'employer'; // Upgrade session for requested role
        localStorage.setItem('user', JSON.stringify(u));
        navigate('/employer-dashboard');
      } else if (isRecruiterUser || role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      console.warn('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3.5rem', maxWidth: '460px' }}>
      <div className="card-glass" style={{ padding: '2.25rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          {role === 'employer' ? 'Recruiter' : 'Applicant'} <span className="gradient-text">Sign In</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {role === 'employer'
            ? 'Sign in to post shifts & hire applicants in Kottayam & Kerala.'
            : 'Sign in to browse & apply for part-time shifts in Kottayam & Kerala.'}
        </p>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role Switcher Tabs */}
          <div className="form-group">
            <label className="form-label">Sign In As:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${role === 'seeker' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('seeker')}
                style={{ padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <User size={16} /> Applicant
              </button>
              <button
                type="button"
                className={`btn ${role === 'employer' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('employer')}
                style={{ padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <ShieldCheck size={16} /> Recruiter
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1.25rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : <>{role === 'employer' ? 'Recruiter Sign In' : 'Applicant Sign In'} <LogIn size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};
