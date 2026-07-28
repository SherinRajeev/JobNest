import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Coffee, ShoppingBag, Truck, GraduationCap, Calendar, Building, Navigation } from 'lucide-react';
import { JobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { MapView } from '../components/MapView';

export const Home = () => {
  const { jobs, filters, setFilters, fetchJobs, detectedCity, isGpsActive, trackUserLocation } = useContext(JobContext);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(filters);
    navigate('/jobs');
  };

  const handleCategoryClick = (cat) => {
    const updated = { ...filters, category: cat };
    setFilters(updated);
    fetchJobs(updated);
    navigate('/jobs');
  };

  const categories = [
    { title: 'Cafe & Barista', icon: Coffee, count: '12 Shifts Nearby', color: 'var(--amber)' },
    { title: 'Retail & Store', icon: ShoppingBag, count: '18 Shifts Nearby', color: 'var(--primary)' },
    { title: 'Delivery & Logistics', icon: Truck, count: '24 Shifts Nearby', color: 'var(--emerald)' },
    { title: 'Tutoring & Education', icon: GraduationCap, count: '9 Shifts Nearby', color: '#0284c7' },
    { title: 'Event Staff', icon: Calendar, count: '15 Shifts Nearby', color: '#e11d48' },
    { title: 'Office & Admin', icon: Building, count: '7 Shifts Nearby', color: '#7c3aed' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        {/* GPS Live Tracking Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--emerald-light)', border: '1px solid rgba(5,150,105,0.25)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--emerald)', marginBottom: '1.25rem' }}>
          <Navigation size={13} /> Near: {detectedCity} {isGpsActive ? '(Live GPS Active)' : ''}
          <button onClick={trackUserLocation} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', marginLeft: '0.3rem', textDecoration: 'underline' }}>
            Auto-Detect Location
          </button>
        </div>

        <h1 className="hero-title">
          Find Part-Time <span className="gradient-text">Shifts & Recruiter Jobs</span> Near You
        </h1>
        <p className="hero-subtitle">
          JobNest auto-tracks your live GPS location to calculate real distances and show nearby shifts, retail opportunities, and recruiters right around you.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar-hero">
          <div className="search-input-group">
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search by city, store name, or shift keyword (e.g. Kottayam, Kochi, Trivandrum)..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="search-divider" />
          <div className="search-input-group" style={{ maxWidth: '220px' }}>
            <MapPin size={20} color="var(--emerald)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Within {filters.maxDistance} km</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', borderRadius: '18px' }}>
            Find Near Me <ArrowRight size={16} />
          </button>
        </form>
      </section>

      {/* Map Interactive Radar Section */}
      <section style={{ margin: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Live GPS <span className="gradient-text">Shift Radar Map</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Live recruiters & active openings centered around {detectedCity}.</p>
          </div>
          <button onClick={() => navigate('/jobs')} className="btn btn-secondary btn-sm">
            View Map & Filters
          </button>
        </div>
        <MapView jobs={jobs.slice(0, 6)} onSelectJob={job => setSelectedJob(job)} />
      </section>

      {/* Popular Categories */}
      <section style={{ margin: '4rem 0' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Explore Popular <span className="gradient-text">Local Categories</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="card-glass"
                onClick={() => handleCategoryClick(cat.title)}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1.75rem 1rem' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: cat.color }}>
                  <Icon size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{cat.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Featured Jobs */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Closest Shifts <span className="gradient-text">Near {detectedCity}</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Sorted automatically by exact GPS distance from your location.</p>
          </div>
          <button onClick={() => navigate('/jobs')} className="btn btn-primary btn-sm">
            Browse All ({jobs.length})
          </button>
        </div>

        <div className="jobs-grid">
          {jobs.slice(0, 6).map(job => (
            <JobCard key={job._id} job={job} onViewDetails={j => setSelectedJob(j)} />
          ))}
        </div>
      </section>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};
