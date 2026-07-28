import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, CheckCircle2, XCircle, Clock, Phone, Mail, UserCheck } from 'lucide-react';
import API from '../services/api';

export const EmployerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployerApps = async () => {
    try {
      const { data } = await API.get('/applications/employer');
      setApplications(data);
    } catch (err) {
      console.error('Error fetching employer applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerApps();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev =>
        prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  const hiredCount = applications.filter(a => a.status === 'Hired').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Employer <span className="gradient-text">Hiring Portal</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your part-time shift postings & review nearby candidates</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">
          <PlusCircle size={18} /> Post New Part-Time Shift
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Total Applicants</span>
            <Users size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{applications.length}</div>
        </div>

        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Shortlisted</span>
            <Clock size={20} color="var(--amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--amber)' }}>{shortlistedCount}</div>
        </div>

        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span>Hired Candidates</span>
            <UserCheck size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{hiredCount}</div>
        </div>
      </div>

      {/* Applicant Review Section */}
      <div className="card-glass">
        <h3 style={{ marginBottom: '1.25rem' }}>Nearby Applicant Submissions</h3>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading applicants...</div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No applicant submissions received yet for your postings.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Target Shift</th>
                  <th>Contact Info</th>
                  <th>Availability & Note</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={app.applicant?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="avatar-sm" />
                        <div>
                          <div style={{ fontWeight: 700 }}>{app.applicant?.name || 'Alex Johnson'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{app.applicant?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.job?.title || 'Part-Time Position'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#34d399' }}>${app.job?.hourlyRate || '18'}/hr</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={13} color="var(--primary)" /> {app.phone || app.applicant?.phone || 'N/A'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--amber)' }}>{app.availability}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.coverNote || 'No cover note provided'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${app.status === 'Hired' ? 'badge-emerald' : app.status === 'Shortlisted' ? 'badge-amber' : app.status === 'Rejected' ? 'badge-rose' : 'badge-primary'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Shortlist Candidate"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'Hired')}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Hire Candidate"
                        >
                          Hire
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Reject Application"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
