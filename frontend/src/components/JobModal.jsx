import React, { useState, useContext } from 'react';
import { X, MapPin, Clock, CheckCircle2, Send, AlertCircle, IndianRupee } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';

export const JobModal = ({ job, onClose }) => {
  const { user } = useContext(AuthContext);
  const { applyJob } = useContext(JobContext);

  const [coverNote, setCoverNote] = useState('');
  const [availability, setAvailability] = useState('Immediate (Weekends & Evenings)');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!job) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in as an Applicant to submit.');
      return;
    }
    if (user.role !== 'seeker') {
      setError('Admin accounts cannot submit job applications.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await applyJob(job._id, coverNote, availability, phone);
      setMessage('Application submitted successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div className="company-logo" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
            {job.company.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="badge badge-primary">{job.category}</span>
            <h2 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{job.title}</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{job.company} • {job.locationName}</div>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hourly Rate</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>₹{job.hourlyRate}/hr</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Shift Timing</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.shiftTiming}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Distance</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.distanceKm || 1.2} km away</div>
          </div>
        </div>

        <div style={{ margin: '1.25rem 0' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>About the Role</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div style={{ margin: '1rem 0' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Requirements</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {job.requirements.map((req, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={14} color="var(--primary)" /> {req}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleApply} style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Submit Quick Application</h4>

          <div className="form-group">
            <label className="form-label">Phone / WhatsApp Number</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 00000"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Availability</label>
            <input
              type="text"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              placeholder="e.g. Immediate, Weekends, After 5 PM"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Note (Optional)</label>
            <textarea
              rows="3"
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder="Briefly mention relevant experience or location suitability..."
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Submitting...' : <>Submit Application <Send size={16} /></>}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
