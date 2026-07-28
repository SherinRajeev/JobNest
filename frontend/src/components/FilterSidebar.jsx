import React from 'react';
import { Filter, MapPin, DollarSign, Clock, Layers } from 'lucide-react';

export const FilterSidebar = ({ filters, setFilters, onApply }) => {
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
    'Flexible',
    'Morning (8AM - 1PM)',
    'Afternoon (1PM - 6PM)',
    'Evening (6PM - 11PM)',
    'Weekend Special'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    if (onApply) onApply(updated);
  };

  const resetFilters = () => {
    const initial = {
      search: '',
      category: 'All',
      maxDistance: 10,
      minRate: 0,
      shiftTiming: 'All'
    };
    setFilters(initial);
    if (onApply) onApply(initial);
  };

  return (
    <aside className="filter-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--primary)" /> Filter Jobs
        </h3>
        <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
          Reset
        </button>
      </div>

      {/* Maximum Distance Slider */}
      <div className="filter-group">
        <label className="filter-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="var(--primary)" /> Max Distance
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{filters.maxDistance} km</span>
        </label>
        <input
          type="range"
          name="maxDistance"
          min="1"
          max="25"
          step="1"
          value={filters.maxDistance}
          onChange={handleChange}
          className="range-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
          <span>1 km</span>
          <span>10 km</span>
          <span>25 km</span>
        </div>
      </div>

      {/* Minimum Pay Rate */}
      <div className="filter-group">
        <label className="filter-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} color="#34d399" /> Min Hourly Pay
          </span>
          <span style={{ color: '#34d399', fontWeight: 700 }}>${filters.minRate}/hr</span>
        </label>
        <input
          type="range"
          name="minRate"
          min="0"
          max="40"
          step="2"
          value={filters.minRate}
          onChange={handleChange}
          className="range-slider"
        />
      </div>

      {/* Category Selection */}
      <div className="filter-group">
        <label className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={15} color="var(--primary)" /> Category
        </label>
        <select name="category" value={filters.category} onChange={handleChange} className="form-control">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Shift Timing */}
      <div className="filter-group">
        <label className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={15} color="var(--amber)" /> Shift Timing
        </label>
        <select name="shiftTiming" value={filters.shiftTiming} onChange={handleChange} className="form-control">
          {shiftTimings.map(shift => (
            <option key={shift} value={shift}>{shift}</option>
          ))}
        </select>
      </div>
    </aside>
  );
};
