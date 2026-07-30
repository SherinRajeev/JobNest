import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, IndianRupee, Clock, Layers, AlertCircle, Building, CheckCircle2, Award } from 'lucide-react';
import { JobContext } from '../context/JobContext';

export const PostJob = () => {
  const { createJobPost } = useContext(JobContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Cafe & Barista',
    hourlyRate: 250,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 15,
    locationName: 'Near KSRTC Bus Stand, Kottayam Town',
    distanceKm: 0.5,
    description: '',
    requirements: 'Friendly customer interaction, Punctual attendance, Basic Malayalam/English fluency',
    perks: 'Free shift beverage & snacks, Performance tips, Flexible roster'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reqArray = formData.requirements ? formData.requirements.split(',').map(r => r.trim()).filter(Boolean) : [];
    const perkArray = formData.perks ? formData.perks.split(',').map(p => p.trim()).filter(Boolean) : [];

    const payload = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      requirements: reqArray,
      perks: perkArray,
      coordinates: { lat: 9.5916, lng: 76.5222 }
    };

    try {
      await createJobPost(payload);
      navigate('/employer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish shift opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '780px' }}>
      <div className="card-glass" style={{ padding: '2rem', borderRadius: '24px' }}>
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Post a <span className="gradient-text">Shift Opening</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Broadcast your part-time shift requirements to nearby registered applicants in Kottayam & Kerala.
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Shift Info */}
          <div className="responsive-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Shift Position Title *</label>
              <input
                type="text"
                placeholder="e.g. Weekend Coffee Barista & Billing Staff"
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
                placeholder="e.g. Indian Coffee House / Pothys Silks"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Section 2: Category, Pay & Timing */}
          <div className="responsive-form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
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
                <option value="Weekend Special">Weekend Special</option>
                <option value="Evening (6PM - 11PM)">Evening (6PM - 11PM)</option>
                <option value="Morning (8AM - 1PM)">Morning (8AM - 1PM)</option>
                <option value="Afternoon (1PM - 6PM)">Afternoon (1PM - 6PM)</option>
                <option value="Flexible">Flexible Hours</option>
              </select>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="form-group">
            <label className="form-label">Store Location / Address *</label>
            <input
              type="text"
              placeholder="e.g. Near KSRTC Bus Stand, Kottayam Town, Kerala"
              value={formData.locationName}
              onChange={e => setFormData({ ...formData, locationName: e.target.value })}
              className="form-control"
              required
            />
          </div>

          {/* Section 4: Description */}
          <div className="form-group">
            <label className="form-label">Shift Tasks & Description *</label>
            <textarea
              rows="3"
              placeholder="Describe shift duties, work atmosphere, and applicant expectations..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
              required
            />
          </div>

          {/* Section 5: Requirements & Perks */}
          <div className="form-group">
            <label className="form-label">Requirements (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Espresso machine knowledge, Malayalam fluency, Weekend availability"
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

          <div className="responsive-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '0.8rem' }} disabled={loading}>
              {loading ? 'Publishing Shift...' : <>Publish Shift Opening <PlusCircle size={18} /></>}
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
