import React, { useContext } from 'react';
import { Filter, RotateCcw, MapPin, Search, Navigation } from 'lucide-react';
import { JobContext } from '../context/JobContext';

export const FilterSidebar = () => {
  const { filters, setFilters, fetchJobs, detectedCity, setCityLocation, trackUserLocation, isGpsActive, gpsStatusMessage } = useContext(JobContext);

  const categories = [
    'All',
    'Cafe & Barista',
    'Retail & Store',
    'Delivery & Logistics',
    'Tutoring & Education',
    'Event Staff',
    'Office & Admin'
  ];

  const shiftTimings = [
    'All',
    'Morning (8AM - 1PM)',
    'Evening (6PM - 11PM)',
    'Weekend Special',
    'Flexible'
  ];

  const cities = [
    { label: '📍 Kottayam Town', value: 'kottayam' },
    { label: '📍 Kochi / Ernakulam', value: 'kochi' },
    { label: '📍 Thiruvananthapuram', value: 'trivandrum' },
    { label: '📍 Thrissur', value: 'thrissur' },
    { label: '📍 Kozhikode', value: 'kozhikode' }
  ];

  const handleReset = () => {
    const defaultF = {
      search: '',
      category: 'All',
      maxDistance: 300,
      minRate: 0,
      shiftTiming: 'All'
    };
    setFilters(defaultF);
    setCityLocation('kottayam');
    fetchJobs(defaultF);
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--primary)" /> Filters
        </h3>
        <button
          onClick={handleReset}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* GPS Auto-Location Detection Button & City Selector */}
      <div className="form-group" style={{ marginBottom: '1.25rem', background: 'var(--slate-bg)', padding: '0.95rem', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.82rem', color: isGpsActive ? 'var(--emerald)' : '#0284c7', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
            <MapPin size={14} /> {detectedCity}
          </label>
        </div>

        <button
          type="button"
          onClick={trackUserLocation}
          className="btn btn-primary btn-sm btn-full"
          style={{
            marginBottom: '0.6rem',
            padding: '0.55rem',
            fontSize: '0.84rem',
            background: isGpsActive ? 'var(--emerald)' : 'var(--primary)',
            borderColor: isGpsActive ? 'var(--emerald)' : 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Navigation size={14} /> {isGpsActive ? 'GPS Active (Re-detect)' : 'Detect My Live Location'}
        </button>

        {gpsStatusMessage && (
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {gpsStatusMessage}
          </div>
        )}

        <select
          className="form-control"
          style={{ fontSize: '0.88rem', padding: '0.45rem 0.65rem' }}
          onChange={(e) => setCityLocation(e.target.value)}
          defaultValue="kottayam"
        >
          {cities.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="form-group">
        <label className="form-label">Search Keywords</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Store, title, location..."
            value={filters.search}
            onChange={e => {
              const updated = { ...filters, search: e.target.value };
              setFilters(updated);
              fetchJobs(updated);
            }}
            style={{ paddingLeft: '2.2rem' }}
          />
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Distance Radius Slider */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Max Radius</label>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>📍 {filters.maxDistance} km</span>
        </div>
        <input
          type="range"
          min="5"
          max="300"
          step="5"
          value={filters.maxDistance}
          onChange={e => {
            const updated = { ...filters, maxDistance: Number(e.target.value) };
            setFilters(updated);
            fetchJobs(updated);
          }}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>5 km</span>
          <span>150 km</span>
          <span>300 km</span>
        </div>
      </div>

      {/* Hourly Pay Slider */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Min Hourly Pay</label>
          <span style={{ fontSize: '0.85rem', color: 'var(--emerald)', fontWeight: 700 }}>₹{filters.minRate}/hr</span>
        </div>
        <input
          type="range"
          min="0"
          max="800"
          step="20"
          value={filters.minRate}
          onChange={e => {
            const updated = { ...filters, minRate: Number(e.target.value) };
            setFilters(updated);
            fetchJobs(updated);
          }}
          style={{ width: '100%', accentColor: 'var(--emerald)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>₹0/hr</span>
          <span>₹400/hr</span>
          <span>₹800/hr</span>
        </div>
      </div>

      {/* Category Filter List */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                const updated = { ...filters, category: cat };
                setFilters(updated);
                fetchJobs(updated);
              }}
              style={{
                textAlign: 'left',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: filters.category === cat ? 'var(--primary-light)' : 'transparent',
                color: filters.category === cat ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: filters.category === cat ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shift Timing Filter List */}
      <div className="form-group">
        <label className="form-label">Shift Timing</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {shiftTimings.map(t => (
            <button
              key={t}
              onClick={() => {
                const updated = { ...filters, shiftTiming: t };
                setFilters(updated);
                fetchJobs(updated);
              }}
              style={{
                textAlign: 'left',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: filters.shiftTiming === t ? 'var(--primary-light)' : 'transparent',
                color: filters.shiftTiming === t ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: filters.shiftTiming === t ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
