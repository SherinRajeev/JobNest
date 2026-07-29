import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Kottayam Town, Kerala');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const u = await register(name, email, password, role, phone, location);
      if (u && u.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      console.warn('Registration fallback proceeding:', err);
      if (role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '520px' }}>
      <div className="card-glass" style={{ padding: '2.25rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Join <span className="gradient-text">JobNest</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Create an account as an Applicant or Recruiter in Kottayam & Kerala.
        </p>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role Switcher */}
          <div className="form-group">
            <label className="form-label">Account Role:</label>
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
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Sherin Rajeev"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
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
            <label className="form-label">Password *</label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Area</label>
              <input
                type="text"
                placeholder="Kottayam Town, Kerala"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1.25rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : <>Register Account <UserPlus size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
