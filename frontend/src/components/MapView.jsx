import React, { useEffect, useRef } from 'react';

export const MapView = ({ jobs, onSelectJob }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Destroy existing map instance on re-render
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Kottayam Town, Kerala
    const defaultCenter = [9.5916, 76.5222];

    // Initialize Leaflet Map
    const map = window.L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const bounds = window.L.latLngBounds();

    // Try browser geolocation to center visitor automatically if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const userLatLng = [userLat, userLng];

          const userIcon = window.L.divIcon({
            className: 'user-pin-custom',
            html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(5,150,105,0.8);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          window.L.marker(userLatLng, { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Your Live Location</b>');

          bounds.extend(userLatLng);
        },
        () => {
          // Fallback to Kottayam Center
          const userIcon = window.L.divIcon({
            className: 'user-pin-custom',
            html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(5,150,105,0.8);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          window.L.marker(defaultCenter, { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Your Location</b><br/>Kottayam Town Center');

          bounds.extend(defaultCenter);
        }
      );
    }

    // Render Job Pin Markers
    jobs.forEach((job) => {
      const lat = job.coordinates?.lat || 9.5916;
      const lng = job.coordinates?.lng || 76.5222;
      const jobLatLng = [lat, lng];

      bounds.extend(jobLatLng);

      const jobPinHtml = `
        <div style="
          background: #2563eb;
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(37,99,235,0.45);
          white-space: nowrap;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          📍 ₹${job.hourlyRate}/hr
        </div>
      `;

      const jobIcon = window.L.divIcon({
        className: 'job-pin-custom',
        html: jobPinHtml,
        iconSize: [85, 32],
        iconAnchor: [42, 16]
      });

      const marker = window.L.marker(jobLatLng, { icon: jobIcon }).addTo(map);

      // Popup Content
      const popupDiv = document.createElement('div');
      popupDiv.style.padding = '4px';
      popupDiv.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">${job.category}</div>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin: 3px 0;">${job.title}</div>
        <div style="font-size: 12px; color: #475569;">${job.company}</div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">📍 ${job.locationName} (${job.distanceKm || 1.2} km)</div>
        <div style="font-size: 15px; font-weight: 800; color: #059669; margin-bottom: 8px;">₹${job.hourlyRate}/hr</div>
        <button id="popup-apply-btn-${job._id}" style="
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 7px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          width: 100%;
        ">
          Apply Now
        </button>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-apply-btn-${job._id}`);
        if (btn) {
          btn.onclick = () => onSelectJob(job);
        }
      });
    });

    // Auto-fit bounds if we have jobs
    if (jobs.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [jobs, onSelectJob]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#0f172a', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
        Real-Time OpenStreetMap ({jobs.length} recruiter pins active)
      </div>
    </div>
  );
};
