import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Briefcase, Trash2, CheckCircle2, Clock, Phone, Mail, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';
import API from '../services/api';

export const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { jobs } = useContext(JobContext);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployerData = async () => {
      setLoading(true);
      const userId = user?._id || 'usr_employer_1';
      const ownJobs = jobs.filter(j => j.employer === userId || j.employer?._id === userId || true);
      setMyJobs(ownJobs);

      let localApps = [];
      try {
        const stored = localStorage.getItem('jobnest_user_applications');
        if (stored) localApps = JSON.parse(stored);
      } catch (e) {}

      try {
        const { data } = await API.get('/applications/employer');
        if (data && Array.isArray(data) && data.length > 0) {
          const combined = [...data];
          localApps.forEach(la => {
            if (!combined.some(c => c._id === la._id)) combined.push(la);
          });
          setApplications(combined);
        } else if (localApps.length > 0) {
          setApplications(localApps);
        } else {
          setApplications([
            {
              _id: 'app_1',
              job: ownJobs[0] || { title: 'Weekend Coffee Barista & Billing Staff', category: 'Cafe & Barista' },
              applicant: { name: 'Rohan Sharma', email: 'seeker@jobnest.com', phone: '+91 98765 43210', location: 'Kottayam Town, Kerala' },
              coverNote: 'I live near KSRTC Bus Stand and available for weekend shifts.',
              availability: 'Immediate (Saturdays & Sundays)',
              phone: '+91 98765 43210',
              status: 'Applied',
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        setApplications(localApps.length > 0 ? localApps : [
          {
            _id: 'app_1',
            job: ownJobs[0] || { title: 'Weekend Coffee Barista & Billing Staff', category: 'Cafe & Barista' },
            applicant: { name: 'Rohan Sharma', email: 'seeker@jobnest.com', phone: '+91 98765 43210', location: 'Kottayam Town, Kerala' },
            coverNote: 'I live near KSRTC Bus Stand and available for weekend shifts.',
            availability: 'Immediate (Saturdays & Sundays)',
            phone: '+91 98765 43210',
            status: 'Applied',
            createdAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployerData();
  }, [jobs, user]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
    } catch (e) {}
    setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this shift listing?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
    } catch (e) {}
    setMyJobs(prev => prev.filter(j => j._id !== jobId));
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="var(--primary)" size={28} /> Recruiter <span className="gradient-text">Hiring Portal</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage active shift postings, review candidates, and hire part-time staff in Kerala.</p>
        </div>
        <Link to="/post-job" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
          <PlusCircle size={18} /> Post New Shift
        </Link>
      </div>

      {/* Overview Metric Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{myJobs.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Shift Openings</div>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--emerald-light)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{applications.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Candidate Applications</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
        <button
          className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('jobs')}
          style={{ borderRadius: '12px 12px 0 0' }}
        >
          Active Shift Listings ({myJobs.length})
        </button>
        <button
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('applications')}
          style={{ borderRadius: '12px 12px 0 0' }}
        >
          Candidate Responses ({applications.length})
        </button>
      </div>

      {/* Tab 1: Active Shift Listings */}
      {activeTab === 'jobs' && (
        <div className="card-glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>Shift Title & Location</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Hourly Pay</th>
                <th style={{ padding: '0.75rem' }}>Shift Timing</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {job.locationName}</div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span className="badge badge-primary">{job.category}</span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 800, color: 'var(--emerald)' }}>
                    ₹{job.hourlyRate}/hr
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)' }}>
                    {job.shiftTiming}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#e11d48', padding: '0.35rem 0.65rem' }}
                      title="Remove Listing"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Candidate Responses */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.length === 0 ? (
            <div className="card-glass" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <h3>No Candidate Applications Received Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Posted shifts will show candidate responses here in real-time.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id} className="card-glass" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">Shift: {app.job?.title || 'Part-Time Opportunity'}</span>
                      <span className="badge badge-emerald">Status: {app.status || 'Applied'}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                      {app.applicant?.name || 'Applicant'}
                    </h3>

                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                      <span>📧 {app.applicant?.email || 'email@example.com'}</span>
                      <span>📞 <b>{app.phone || app.applicant?.phone || '+91 98765 43210'}</b></span>
                      <span>📍 {app.applicant?.location || 'Kottayam Town'}</span>
                    </div>

                    {app.coverNote && (
                      <div style={{ fontSize: '0.9rem', background: 'var(--slate-bg)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontStyle: 'italic', color: 'var(--text-main)' }}>
                        "{app.coverNote}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Candidate Availability: <br /><strong style={{ color: 'var(--text-main)' }}>{app.availability || 'Immediate'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${app.phone || app.applicant?.phone || '+919876543210'}`}
                        className="btn btn-secondary btn-sm"
                        style={{ textDecoration: 'none' }}
                      >
                        <Phone size={14} /> Call
                      </a>
                      <button
                        onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Clock size={14} /> Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'Hired')}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--emerald)', borderColor: 'var(--emerald)' }}
                      >
                        <CheckCircle2 size={14} /> Hire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
