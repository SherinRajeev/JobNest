import React, { useContext } from 'react';
import { Filter, RotateCcw, Search, MapPin, IndianRupee } from 'lucide-react';
import { JobContext } from '../context/JobContext';

export const FilterSidebar = () => {
  const { filters, setFilters, fetchJobs } = useContext(JobContext);

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
    'Afternoon (1PM - 6PM)',
    'Evening (6PM - 11PM)',
    'Weekend Special',
    'Flexible'
  ];

  const handleCategoryChange = (cat) => {
    const updated = { ...filters, category: cat };
    setFilters(updated);
    fetchJobs(updated);
  };

  const handleShiftChange = (shift) => {
    const updated = { ...filters, shiftTiming: shift };
    setFilters(updated);
    fetchJobs(updated);
  };

  const handleDistanceChange = (e) => {
    const updated = { ...filters, maxDistance: Number(e.target.value) };
    setFilters(updated);
    fetchJobs(updated);
  };

  const handleRateChange = (e) => {
    const updated = { ...filters, minRate: Number(e.target.value) };
    setFilters(updated);
    fetchJobs(updated);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: 'All',
      maxDistance: 250,
      minRate: 0,
      shiftTiming: 'All'
    };
    setFilters(resetFilters);
    fetchJobs(resetFilters);
  };

  return (
    <div className="card-glass" style={{ padding: '1.5rem', height: 'fit-content', sticky: 'top', top: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
          <Filter size={18} color="var(--primary)" /> Filters
        </div>
        <button
          onClick={handleReset}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Search Keywords</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Store, title, location..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && fetchJobs(filters)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Maximum Distance Slider */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Max Radius</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            <MapPin size={13} style={{ display: 'inline', marginRight: '2px' }} />
            {filters.maxDistance} km
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="300"
          step="5"
          value={filters.maxDistance}
          onChange={handleDistanceChange}
          style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>5 km</span>
          <span>150 km</span>
          <span>300 km</span>
        </div>
      </div>

      {/* Minimum Hourly Pay Slider */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Min Hourly Pay</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)' }}>
            ₹{filters.minRate}/hr
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="800"
          step="25"
          value={filters.minRate}
          onChange={handleRateChange}
          style={{ width: '100%', accentColor: 'var(--emerald)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>₹0/hr</span>
          <span>₹400/hr</span>
          <span>₹800/hr</span>
        </div>
      </div>

      {/* Category Selection */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: filters.category === cat ? 600 : 400,
                background: filters.category === cat ? 'var(--primary-light)' : 'transparent',
                color: filters.category === cat ? 'var(--primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shift Timing Filter */}
      <div className="form-group">
        <label className="form-label">Shift Timing</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {shiftTimings.map((st, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleShiftChange(st)}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: filters.shiftTiming === st ? 600 : 400,
                background: filters.shiftTiming === st ? 'rgba(37,99,235,0.08)' : 'transparent',
                color: filters.shiftTiming === st ? 'var(--primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
