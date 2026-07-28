import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, Briefcase, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    phone: '',
    location: 'Downtown Core',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const u = await register(formData);
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

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '520px' }}>
      <div className="card-glass" style={{ padding: '2.25rem' }}>
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Join <span className="gradient-text">JobNest</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Create an account to find or post nearby part-time opportunities.
        </p>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role Switcher */}
          <div className="form-group">
            <label className="form-label">I want to:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${formData.role === 'seeker' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData({ ...formData, role: 'seeker' })}
                style={{ fontSize: '0.88rem' }}
              >
                <UserCheck size={16} /> Find Nearby Jobs
              </button>
              <button
                type="button"
                className={`btn ${formData.role === 'employer' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormData({ ...formData, role: 'employer' })}
                style={{ fontSize: '0.88rem' }}
              >
                <Briefcase size={16} /> Hire Part-Timers
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="form-control"
              required
              minLength={6}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / Neighborhood</label>
              <input
                type="text"
                placeholder="e.g. Downtown Core"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} disabled={loading}>
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
