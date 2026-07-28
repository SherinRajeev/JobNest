import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, IndianRupee, Clock, Layers, AlertCircle } from 'lucide-react';
import { JobContext } from '../context/JobContext';

export const PostJob = () => {
  const { createJobPost } = useContext(JobContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Cafe & Barista',
    hourlyRate: 250,
    shiftTiming: 'Flexible',
    hoursPerWeek: 15,
    locationName: '',
    distanceKm: 1.2,
    description: '',
    requirements: '',
    perks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createJobPost(formData);
      navigate('/employer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '780px' }}>
      <div className="card-glass">
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Post a <span className="gradient-text">Shift Opening</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Broadcast your shift requirements to nearby registered applicants.</p>

        {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Shift Position Title *</label>
              <input
                type="text"
                placeholder="e.g. Weekend Barista & Shift Associate"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Store / Company Name *</label>
              <input
                type="text"
                placeholder="e.g. Third Wave Coffee"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="form-control"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="form-control"
              >
                <option value="Cafe & Barista">Cafe & Barista</option>
                <option value="Retail & Store">Retail & Store</option>
                <option value="Delivery & Logistics">Delivery & Logistics</option>
                <option value="Tutoring & Education">Tutoring & Education</option>
                <option value="Event Staff">Event Staff</option>
                <option value="Office & Admin">Office & Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hourly Pay Rate (₹/hr) *</label>
              <input
                type="number"
                step="10"
                value={formData.hourlyRate}
                onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shift Timing *</label>
              <select
                value={formData.shiftTiming}
                onChange={e => setFormData({ ...formData, shiftTiming: e.target.value })}
                className="form-control"
              >
                <option value="Flexible">Flexible</option>
                <option value="Morning (8AM - 1PM)">Morning (8AM - 1PM)</option>
                <option value="Afternoon (1PM - 6PM)">Afternoon (1PM - 6PM)</option>
                <option value="Evening (6PM - 11PM)">Evening (6PM - 11PM)</option>
                <option value="Weekend Special">Weekend Special</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Store Location / Address *</label>
              <input
                type="text"
                placeholder="e.g. 100ft Road, Indiranagar, Bengaluru"
                value={formData.locationName}
                onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Distance Radius (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distanceKm}
                onChange={e => setFormData({ ...formData, distanceKm: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shift Description *</label>
            <textarea
              rows="4"
              placeholder="Describe shift tasks, work atmosphere, and candidate expectations..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Espresso machine knowledge, Good communication, Weekend availability"
              value={formData.requirements}
              onChange={e => setFormData({ ...formData, requirements: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Perks & Incentives (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Free beverage per shift, Travel allowance, Flexible roster"
              value={formData.perks}
              onChange={e => setFormData({ ...formData, perks: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Publishing...' : <>Publish Shift Opening <PlusCircle size={18} /></>}
            </button>
            <button type="button" onClick={() => navigate('/employer-dashboard')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
