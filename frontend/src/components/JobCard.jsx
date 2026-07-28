import React, { useContext } from 'react';
import { MapPin, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';

export const JobCard = ({ job, onViewDetails }) => {
  const { user } = useContext(AuthContext);
  const { toggleBookmark } = useContext(JobContext);

  const isSaved = user?.savedJobs?.includes(job._id);

  return (
    <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="job-card-header">
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div className="company-logo">
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="job-title">{job.title}</h3>
              <div className="job-company">{job.company}</div>
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(job._id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isSaved ? '#d97706' : 'var(--text-dim)',
              transition: 'var(--transition)'
            }}
            title={isSaved ? 'Remove Bookmark' : 'Save Job'}
          >
            <Bookmark size={20} fill={isSaved ? '#d97706' : 'none'} />
          </button>
        </div>

        <div style={{ margin: '0.85rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{job.category}</span>
          <span className="badge badge-amber"><Clock size={12} /> {job.shiftTiming}</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.85rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        <div className="job-meta-row">
          <div className="job-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="var(--primary)" />
            <span>{job.locationName} ({job.distanceKm || 1.2} km away)</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="pay-rate">₹{job.hourlyRate}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/hr</span>
        </div>
        <button onClick={() => onViewDetails(job)} className="btn btn-secondary btn-sm">
          Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
