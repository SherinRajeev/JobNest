import React, { useState, useContext } from 'react';
import { X, Key, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export const ResetPasswordModal = ({ onClose }) => {
  const { userDatabase } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanPass = newPassword.trim();

    if (cleanPass.length < 4) {
      setError('Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    try {
      try {
        await API.post('/auth/reset-password', { email: normEmail, phone: cleanPhone, newPassword: cleanPass });
      } catch (err) {
        console.warn('Backend API reset fallback proceeding');
      }

      // Local storage database update fallback
      const stored = localStorage.getItem('jobnest_users_db');
      let db = stored ? JSON.parse(stored) : [];

      const userIndex = db.findIndex(u => u.email.toLowerCase() === normEmail);
      if (userIndex !== -1) {
        db[userIndex].password = cleanPass;
        localStorage.setItem('jobnest_users_db', JSON.stringify(db));
        setSuccess(true);
      } else {
        setError('No account found with this email address. Please check your email or register.');
      }
    } catch (err) {
      setError('Failed to reset password. Please verify your registered email and phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '2rem' }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <X size={20} color="var(--text-muted)" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Key size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Reset Your <span className="gradient-text">Password</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Enter your registered email and phone number to create a new password.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ color: 'var(--emerald)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Password Reset Successful!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You can now sign in using your new password.
            </p>
            <button onClick={onClose} className="btn btn-primary btn-full">
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Registered Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Registered Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">New Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  required
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
