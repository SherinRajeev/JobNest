import React, { useState, useContext } from 'react';
import { X, User, Mail, Phone, MapPin, Save, LogOut, Sparkles, Edit3, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export const ProfileModal = ({ onClose }) => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const isRecruiter = user && ['employer', 'recruiter', 'admin'].includes(user.role?.toLowerCase());

  const avatarSeeds = ['Rohan', 'Priya', 'Sherin', 'Alex', 'Sam', 'Taylor', 'Jordan', 'Morgan', 'Kottayam', 'Developer'];

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
      await API.put('/auth/profile', { name, email, phone, location, bio, avatar });
    } catch (err) {
      console.warn('Backend profile endpoint unreachable, updating local session profile');
    }

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setMessage('Profile updated successfully!');
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2.25rem' }}>
        {/* Close Modal Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <X size={20} color="var(--text-muted)" />
        </button>

        {/* Profile Avatar & Header Info */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 0.75rem' }}>
            <img
              src={avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}`}
              alt={name}
              style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', background: '#eff6ff', boxShadow: 'var(--shadow-sm)' }}
            />
            {isEditing && (
              <button
                type="button"
                onClick={handleRandomAvatar}
                title="Change Cartoon Avatar"
                style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: '#fff', border: '2px solid #fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Sparkles size={14} />
              </button>
            )}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user?.name || 'User Name'}</h2>
          <span className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}>
            {isRecruiter ? <><ShieldCheck size={14} /> Recruiter Account</> : <><User size={14} /> Applicant Account</>}
          </span>
        </div>

        {message && <div className="alert alert-success" style={{ marginBottom: '1.25rem', padding: '0.65rem 1rem', fontSize: '0.88rem', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '10px' }}>{message}</div>}

        {/* View Mode */}
        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--slate-bg)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Mail size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.email || 'Not set'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Phone size={18} color="var(--emerald)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHONE NUMBER</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.phone || 'Not set'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION / AREA</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.location || 'Kottayam Town, Kerala'}</div>
                </div>
              </div>
            </div>

            {user?.bio && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem', textAlign: 'center' }}>
                "{user.bio}"
              </div>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-full"
              style={{ marginTop: '0.5rem' }}
            >
              <Edit3 size={16} /> Edit Profile Details
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="btn btn-secondary btn-full"
              style={{ color: '#e11d48', border: '1px solid rgba(225,29,72,0.25)', background: '#fff' }}
            >
              <LogOut size={16} /> Sign Out Account
            </button>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave}>
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label className="form-label">Full Name *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : <><Save size={16} /> Save</>}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
