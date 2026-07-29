import React, { useState, useContext } from 'react';
import { X, User, Mail, Phone, MapPin, Save, LogOut, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export const ProfileModal = ({ onClose }) => {
  const { user, setUser, logout } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isRecruiter = user && ['employer', 'recruiter', 'admin'].includes(user.role?.toLowerCase());

  const avatarSeeds = ['Rohan', 'Priya', 'Sherin', 'Alex', 'Sam', 'Taylor', 'Jordan', 'Morgan'];

  const handleRandomAvatar = () => {
    const randomSeed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)] + Math.floor(Math.random() * 100);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      location,
      bio,
      avatar
    };

    try {
      // Send update request to backend if available
      await API.put('/auth/profile', { name, email, phone, location, bio, avatar });
    } catch (err) {
      console.warn('Backend profile endpoint unreachable, updating local session profile');
    }

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setMessage('Profile updated successfully!');
    setLoading(false);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
        <button onClick={onClose} className="modal-close-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="var(--text-muted)" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 0.75rem' }}>
            <img
              src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}`}
              alt={name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', background: '#eff6ff' }}
            />
            <button
              type="button"
              onClick={handleRandomAvatar}
              title="Change Cartoon Avatar"
              style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Sparkles size={14} />
            </button>
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{name}</h2>
          <span className="badge badge-primary" style={{ fontSize: '0.78rem' }}>
            {isRecruiter ? 'Recruiter Account' : 'Applicant Account'}
          </span>
        </div>

        {message && <div className="alert alert-success" style={{ marginBottom: '1rem', padding: '0.6rem 1rem', fontSize: '0.88rem' }}>{message}</div>}

        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
                required
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Phone Number * (Mandatory)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ paddingLeft: '2.4rem' }}
                required
              />
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Location / Area</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Kottayam Town, Kerala"
                style={{ paddingLeft: '2.4rem' }}
              />
              <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Bio / Headline</label>
            <textarea
              className="form-control"
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell recruiters or applicants about yourself..."
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginBottom: '0.75rem' }}>
            {loading ? 'Saving Profile...' : <><Save size={16} /> Save Profile Changes</>}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            logout();
            onClose();
          }}
          className="btn btn-secondary btn-full"
          style={{ color: '#e11d48', border: '1px solid rgba(225,29,72,0.2)' }}
        >
          <LogOut size={16} /> Sign Out Account
        </button>
      </div>
    </div>
  );
};
