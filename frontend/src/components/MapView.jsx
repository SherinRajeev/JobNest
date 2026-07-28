import React, { useEffect, useRef } from 'react';

export const MapView = ({ jobs, onSelectJob }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Destroy existing map instance on re-render to avoid duplicate initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Marine Drive, Kochi, Kerala
    const kochiCenter = [9.9790, 76.2750];

    // Initialize real Leaflet OpenStreetMap instance
    const map = window.L.map(mapContainerRef.current).setView(kochiCenter, 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add User Location Pulse Marker at Marine Drive
    const userIcon = window.L.divIcon({
      className: 'user-location-marker',
      html: `<div style="width: 22px; height: 22px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(5,150,105,0.8);"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    window.L.marker(kochiCenter, { icon: userIcon })
      .addTo(map)
      .bindPopup(`<b>Your Location</b><br/>Marine Drive, Kochi, Kerala`);

    // Render Real Job Pin Markers across Kochi
    jobs.forEach((job) => {
      const lat = job.coordinates?.lat || 9.9790;
      const lng = job.coordinates?.lng || 76.2750;

      const customIcon = window.L.divIcon({
        className: 'real-job-marker',
        html: `<div style="background: #2563eb; color: #ffffff; font-weight: 700; font-size: 12px; padding: 4px 8px; border-radius: 16px; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(37,99,235,0.4); white-space: nowrap;">
                 ₹${job.hourlyRate}/hr
               </div>`,
        iconSize: [70, 26],
        iconAnchor: [35, 13]
      });

      const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">${job.category}</div>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin: 2px 0;">${job.title}</div>
        <div style="font-size: 12px; color: #475569;">${job.company} • ${job.locationName}</div>
        <div style="font-size: 14px; font-weight: 800; color: #059669; margin: 6px 0;">₹${job.hourlyRate}/hr</div>
        <button id="popup-apply-${job._id}" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; width: 100%;">
          Apply Now
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-apply-${job._id}`);
        if (btn) {
          btn.onclick = () => onSelectJob(job);
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [jobs, onSelectJob]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#0f172a', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
        Real OpenStreetMap • Kochi, Kerala ({jobs.length} recruiters active)
      </div>
    </div>
  );
};
