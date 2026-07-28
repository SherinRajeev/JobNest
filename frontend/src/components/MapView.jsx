import React, { useState } from 'react';
import { MapPin, Navigation, DollarSign, ExternalLink } from 'lucide-react';

export const MapView = ({ jobs, onSelectJob }) => {
  const [activePin, setActivePin] = useState(null);

  // Position calculation for visual representation
  const getCoordinatesPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radiusPercentage = 25 + (index % 3) * 12;
    const top = 50 + radiusPercentage * Math.sin(angle);
    const left = 50 + radiusPercentage * Math.cos(angle);
    return { top: `${Math.max(15, Math.min(80, top))}%`, left: `${Math.max(10, Math.min(85, left))}%` };
  };

  return (
    <div className="map-visualizer">
      <div className="map-grid-overlay" />

      {/* User Center Pin */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.3)',
          border: '2px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px #10b981',
          zIndex: 5
        }}
        title="Your Current Location"
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
      </div>

      {/* Distance Rings */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '380px', height: '380px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

      {/* Render Nearby Job Pins */}
      {jobs.map((job, idx) => {
        const pos = getCoordinatesPosition(idx, jobs.length || 1);
        return (
          <div
            key={job._id}
            className="map-pin"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => setActivePin(job)}
          >
            <MapPin size={14} /> ${job.hourlyRate}/h
          </div>
        );
      })}

      {/* Active Pin Popup Card */}
      {activePin && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            right: '1rem',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            zIndex: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {activePin.category} • {activePin.distanceKm || 1.2} km away
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{activePin.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activePin.company} — ${activePin.hourlyRate}/hr</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onSelectJob(activePin)} className="btn btn-primary btn-sm">
              Apply Now <ExternalLink size={14} />
            </button>
            <button onClick={() => setActivePin(null)} className="btn btn-secondary btn-sm">Close</button>
          </div>
        </div>
      )}

      {/* Map Control Info Overlay */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Navigation size={12} color="#10b981" /> Interactive Radar View ({jobs.length} jobs loaded)
      </div>
    </div>
  );
};
