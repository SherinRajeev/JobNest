import React, { useState, useEffect, useContext } from 'react';
import { BookMarked, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, IndianRupee } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';

export const SeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { jobs } = useContext(JobContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get('/applications/my');
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const savedJobsList = jobs.filter(j => user?.savedJobs?.includes(j._id));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hired':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Hired</span>;
      case 'Shortlisted':
        return <span className="badge badge-amber"><Clock size={12} /> Shortlisted</span>;
      case 'Rejected':
        return <span className="badge badge-rose"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-primary"><AlertCircle size={12} /> Applied</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Applicant <span className="gradient-text">Dashboard</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your submitted shift applications & saved opportunities</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 1.25rem',
            color: activeTab === 'applications' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            borderBottom: activeTab === 'applications' ? '2px solid var(--primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          My Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.85rem 1.25rem',
            color: activeTab === 'bookmarks' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '1rem',
            borderBottom: activeTab === 'bookmarks' ? '2px solid var(--primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          Saved Shifts ({savedJobsList.length})
        </button>
      </div>

      {activeTab === 'applications' ? (
        loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <h3>No Applications Submitted Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Explore nearby shifts and submit your first application!</p>
          </div>
        ) : (
          <div className="table-responsive card-glass" style={{ padding: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Position & Category</th>
                  <th>Company & Location</th>
                  <th>Hourly Pay</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.job?.title || 'Part-Time Shift'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{app.job?.category}</div>
                    </td>
                    <td>
                      <div>{app.job?.company || 'Local Store'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={12} /> {app.job?.locationName || 'Nearby'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>₹{app.job?.hourlyRate || '250'}/hr</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        savedJobsList.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <h3>No Saved Shifts</h3>
            <p style={{ color: 'var(--text-muted)' }}>Click the bookmark icon on any job card to save it for later.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {savedJobsList.map(job => (
              <JobCard key={job._id} job={job} onViewDetails={j => setSelectedJob(j)} />
            ))}
          </div>
        )
      )}

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};
