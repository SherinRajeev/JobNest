import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, Clock, DollarSign, Coffee, ShoppingBag, Truck, GraduationCap, Calendar, Building } from 'lucide-react';
import { JobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { MapView } from '../components/MapView';

export const Home = () => {
  const { jobs, filters, setFilters, fetchJobs } = useContext(JobContext);
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
    { title: 'Cafe & Barista', icon: Coffee, count: '12 Nearby', color: 'var(--amber)' },
    { title: 'Retail & Store', icon: ShoppingBag, count: '18 Nearby', color: 'var(--primary)' },
    { title: 'Delivery & Logistics', icon: Truck, count: '24 Nearby', color: '#34d399' },
    { title: 'Tutoring & Education', icon: GraduationCap, count: '9 Nearby', color: '#38bdf8' },
    { title: 'Event Staff', icon: Calendar, count: '15 Nearby', color: '#f43f5e' },
    { title: 'Office & Admin', icon: Building, count: '7 Nearby', color: '#a78bfa' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="badge badge-primary" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem' }}>
          <Sparkles size={14} /> Revolutionizing Nearby Part-Time Employment
        </div>
        <h1 className="hero-title">
          Find High-Paying <span className="gradient-text">Part-Time Jobs</span> Right Around The Corner
        </h1>
        <p className="hero-subtitle">
          JobNest connects local students, freelancers, and energetic job seekers directly with nearby businesses offering flexible hours and great pay.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar-hero">
          <div className="search-input-group">
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search title, keywords (e.g. Barista, Retail)..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="search-divider" />
          <div className="search-input-group" style={{ maxWidth: '220px' }}>
            <MapPin size={20} color="#10b981" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Within {filters.maxDistance} km</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', borderRadius: '18px' }}>
            Search Nearby <ArrowRight size={16} />
          </button>
        </form>
      </section>

      {/* Map Interactive Radar Section */}
      <section style={{ margin: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Live Neighborhood <span className="gradient-text">Job Radar</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Interactive map preview of active shifts within your vicinity.</p>
          </div>
          <button onClick={() => navigate('/jobs')} className="btn btn-secondary btn-sm">
            View Full Map & Filters
          </button>
        </div>
        <MapView jobs={jobs.slice(0, 6)} onSelectJob={job => setSelectedJob(job)} />
      </section>

      {/* Popular Categories */}
      <section style={{ margin: '4rem 0' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Explore Popular <span className="gradient-text">Part-Time Categories</span>
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
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: cat.color }}>
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
            <h2 style={{ fontSize: '1.75rem' }}>Latest <span className="gradient-text">Part-Time Openings</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Apply in under 60 seconds with instant employer notification.</p>
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
