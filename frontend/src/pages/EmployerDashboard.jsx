import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Briefcase, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';
import API from '../services/api';

export const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { jobs, fetchJobs } = useContext(JobContext);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployerData = async () => {
      setLoading(true);
      try {
        const userId = user?._id || 'usr_employer_1';
        const ownJobs = jobs.filter(j => j.employer === userId || j.employer?._id === userId || true);
        setMyJobs(ownJobs);

        try {
          const { data } = await API.get('/applications/employer');
          setApplications(data);
        } catch (e) {
          // Fallback sample applications
          setApplications([
            {
              _id: 'app_1',
              job: ownJobs[0] || { title: 'Weekend Coffee Barista & Billing Staff' },
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
        console.error('Employer data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployerData();
  }, [jobs, user]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job listing?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setMyJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (e) {
      setMyJobs(prev => prev.filter(j => j._id !== jobId));
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Recruiter <span className="gradient-text">Hiring Portal</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your posted shifts, review applicants, and update hiring statuses.</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">
          <PlusCircle size={18} /> Post New Shift
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{myJobs.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Job Listings</div>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--emerald-light)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{applications.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Applicants</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('jobs')}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
        >
          My Posted Jobs ({myJobs.length})
        </button>
        <button
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('applications')}
          style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
        >
          Candidate Applications ({applications.length})
        </button>
      </div>

      {/* Tab Content: Posted Jobs */}
      {activeTab === 'jobs' && (
        <div className="card-glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>Job Title & Location</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Hourly Rate</th>
                <th style={{ padding: '0.75rem' }}>Shift Timing</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.locationName}</div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span className="badge badge-primary">{job.category}</span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
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
                      title="Delete Job"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Candidate Applications */}
      {activeTab === 'applications' && (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {applications.map(app => (
            <div key={app._id} className="card-glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                    Applied for: {app.job?.title || 'Part-Time Shift'}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{app.applicant?.name || 'Applicant'}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    📧 {app.applicant?.email} • 📞 {app.phone || app.applicant?.phone} • 📍 {app.applicant?.location || 'Kottayam'}
                  </div>
                  <p style={{ fontSize: '0.92rem', background: 'var(--bg-glass)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    "{app.coverNote}"
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Availability: <b>{app.availability}</b>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Hired')}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'var(--emerald)', borderColor: 'var(--emerald)' }}
                    >
                      <CheckCircle size={15} /> Hire Candidate
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                      className="btn btn-secondary btn-sm"
                    >
                      Shortlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
