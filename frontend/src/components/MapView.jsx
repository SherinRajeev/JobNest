import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export const MapView = ({ jobs, onSelectJob }) => {
  const [activePin, setActivePin] = useState(null);

  // Position calculation for visual representation centered around Kochi
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

      {/* User Center Pin - Marine Drive, Kochi */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(5, 150, 105, 0.25)',
          border: '2px solid #059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(5, 150, 105, 0.6)',
          zIndex: 5
        }}
        title="Your Location: Marine Drive, Kochi, Kerala"
      >
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
      </div>

      {/* Distance Radius Circles */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '220px', height: '220px', borderRadius: '50%', border: '1px dashed rgba(15,23,42,0.2)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '380px', height: '380px', borderRadius: '50%', border: '1px dashed rgba(15,23,42,0.12)', pointerEvents: 'none' }} />

      {/* Render Nearby Job Pins with Rupee Symbol */}
      {jobs.map((job, idx) => {
        const pos = getCoordinatesPosition(idx, jobs.length || 1);
        return (
          <div
            key={job._id}
            className="map-pin"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => setActivePin(job)}
          >
            <MapPin size={14} /> ₹{job.hourlyRate}/hr
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
            background: '#ffffff',
            border: '1px solid var(--border-accent)',
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
            <div style={{ fontSize: '0.78rem', color: 'var(--saffron)', fontWeight: 700, textTransform: 'uppercase' }}>
              {activePin.category} • {activePin.distanceKm || 1.2} km away
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{activePin.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activePin.company} — <strong style={{ color: 'var(--emerald)' }}>₹{activePin.hourlyRate}/hr</strong> ({activePin.locationName})</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onSelectJob(activePin)} className="btn btn-primary btn-sm">
              Apply Now <ExternalLink size={14} />
            </button>
            <button onClick={() => setActivePin(null)} className="btn btn-secondary btn-sm">Close</button>
          </div>
        </div>
      )}

      {/* Map Location Overlay */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-subtle)', padding: '0.45rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--shadow-sm)' }}>
        <Navigation size={13} color="#059669" /> Center: Marine Drive, Kochi, Kerala ({jobs.length} recruiters nearby)
      </div>
    </div>
  );
};
