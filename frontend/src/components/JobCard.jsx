import React, { useContext } from 'react';
import { MapPin, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { JobContext } from '../context/JobContext';

export const JobCard = ({ job, onViewDetails }) => {
  const { toggleBookmark, user } = useContext(JobContext);
  const isSaved = user?.savedJobs?.includes(job._id);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    toggleBookmark(job._id);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (onViewDetails) onViewDetails(job);
  };

  return (
    <div
      className="card-glass"
      onClick={handleDetailsClick}
      style={{
        padding: '1.5rem',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%'
      }}
    >
      {/* Header Row: Company Icon, Title, and Bookmark */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: '46px',
            height: '46px',
            minWidth: '46px',
            minHeight: '46px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            border: '1px solid rgba(37,99,235,0.15)',
            flexShrink: 0
          }}>
            {job.company ? job.company.substring(0, 2).toUpperCase() : 'JN'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem', lineHeight: 1.3 }}>
              {job.title}
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {job.company}
            </div>
          </div>
        </div>

        <button
          onClick={handleBookmarkClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isSaved ? 'Remove Bookmark' : 'Save Shift'}
        >
          <Bookmark size={20} fill={isSaved ? 'var(--primary)' : 'none'} color={isSaved ? 'var(--primary)' : 'var(--text-muted)'} />
        </button>
      </div>

      {/* Badges: Category & Shift Timing */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
          {job.category}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--slate-bg)', padding: '0.35rem 0.75rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <Clock size={13} /> {job.shiftTiming || 'Flexible'}
        </span>
      </div>

      {/* Description Snippet */}
      <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        {job.description}
      </p>

      {/* Location Row with Calculated Distance */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: '#0284c7', fontWeight: 500 }}>
        <MapPin size={16} /> {job.locationName} {job.distanceKm !== undefined ? `(${job.distanceKm} km away)` : ''}
      </div>

      {/* Card Footer: Pay Badge on LEFT, Details Button on FAR RIGHT */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '0.25rem',
        width: '100%'
      }}>
        {/* Left Side: Highlighted Emerald Pay Badge */}
        <div style={{
          background: '#ecfdf5',
          color: '#059669',
          border: '1px solid #a7f3d0',
          padding: '0.4rem 0.9rem',
          borderRadius: '20px',
          fontSize: '1.05rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          boxShadow: '0 1px 3px rgba(5,150,105,0.1)'
        }}>
          ₹{job.hourlyRate}<span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>/hr</span>
        </div>

        {/* Far Right Side: Details Button */}
        <button
          type="button"
          onClick={handleDetailsClick}
          className="btn btn-primary btn-sm"
          style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.88rem', marginLeft: 'auto' }}
        >
          Details <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
