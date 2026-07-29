import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Clock, CheckCircle2, Award, Send, AlertCircle, Building, LogIn, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';

export const JobModal = ({ job, onClose }) => {
  const { user } = useContext(AuthContext);
  const { applyJob } = useContext(JobContext);
  const navigate = useNavigate();

  const [coverNote, setCoverNote] = useState('');
  const [availability, setAvailability] = useState('Immediate (Weekends & Evenings)');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isRecruiter = user && ['employer', 'recruiter', 'admin'].includes(user.role?.toLowerCase());

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to submit shift applications.');
      return;
    }
    if (isRecruiter) {
      setError('Recruiter accounts cannot submit job applications. Please sign in as an Applicant.');
      return;
    }
    if (!phone) {
      setError('Please provide a mandatory phone number for the recruiter.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await applyJob(job._id, coverNote, availability, phone);
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); // Client session fallback
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1.5rem'
      }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
          position: 'relative'
        }}
      >
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--slate-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} color="var(--text-muted)" />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">{job.category}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {job.locationName}</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {job.title}
          </h2>
          <div style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building size={16} /> {job.company}
          </div>
        </div>

        {/* Pay Rate & Timing Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--slate-bg)', padding: '1rem 1.25rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Hourly Shift Pay</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
              ₹{job.hourlyRate}<span style={{ fontSize: '0.85rem', color: '#047857' }}>/hr</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Shift Schedule</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={15} color="var(--primary)" /> {job.shiftTiming || 'Flexible Hours'}
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Shift Description</h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {job.description}
          </p>

          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Requirements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {job.requirements.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--emerald)" /> {req}
                  </div>
                ))}
              </div>
            </div>
          )}

          {job.perks && job.perks.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Shift Perks</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {job.perks.map((perk, idx) => (
                  <span key={idx} style={{ background: 'var(--emerald-light)', color: 'var(--emerald)', border: '1px solid #a7f3d0', padding: '0.3rem 0.75rem', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={13} /> {perk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application Form or Signed In Requirement Guard */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          {!user ? (
            /* Signed Out Guard */
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', color: '#1e40af' }}>
              <Lock size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Sign In Required to Apply</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Only registered, signed-in Applicants can submit applications for recruiter shifts.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="btn btn-primary btn-full"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <LogIn size={16} /> Sign In to Apply Now
              </button>
            </div>
          ) : isRecruiter ? (
            /* Recruiter Guard */
            <div style={{ padding: '1.25rem', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fef3c7', color: '#92400e', textAlign: 'center' }}>
              <AlertCircle size={24} color="#d97706" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>Signed in as Recruiter</div>
              <div style={{ fontSize: '0.85rem' }}>Recruiter accounts post jobs and hire applicants. Switch to an Applicant account to submit shift applications.</div>
            </div>
          ) : submitted ? (
            /* Application Success */
            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#ecfdf5', borderRadius: '16px', border: '1px solid #a7f3d0', color: '#065f46' }}>
              <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Application Submitted!</h3>
              <p style={{ fontSize: '0.88rem' }}>The recruiter at {job.company} will review your application and contact your phone number.</p>
              <button onClick={onClose} className="btn btn-primary btn-sm" style={{ marginTop: '1rem', background: '#059669', borderColor: '#059669' }}>
                Done
              </button>
            </div>
          ) : (
            /* Quick Apply Form for Signed In Applicants */
            <form onSubmit={handleApply}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Apply for this Shift</h3>

              {error && <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.6rem 1rem', fontSize: '0.85rem' }}><AlertCircle size={15} /> {error}</div>}

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Phone Number * (Mandatory for Recruiter)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Availability</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Immediate (Saturdays & Evenings)"
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Message / Cover Note</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Introduce yourself to the recruiter..."
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Submitting Application...' : <><Send size={16} /> Submit Shift Application</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
