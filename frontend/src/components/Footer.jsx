import React from 'react';
import { Compass } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          <Compass size={20} color="var(--primary)" /> JobNest &copy; {new Date().getFullYear()} — Your Gateway to Nearby Part-Time Jobs
        </div>
      </div>
    </footer>
  );
};
