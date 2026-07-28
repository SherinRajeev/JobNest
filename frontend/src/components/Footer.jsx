import React from 'react';
import { Compass, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Compass size={20} color="var(--primary)" /> JobNest &copy; {new Date().getFullYear()} — Your Gateway to Nearby Part-Time Jobs
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          Built with MERN Stack (MongoDB, Express, React, Node.js)
        </div>
      </div>
    </footer>
  );
};
