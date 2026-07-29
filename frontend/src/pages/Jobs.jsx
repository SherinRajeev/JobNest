import React, { useContext, useState } from 'react';
import { LayoutGrid, MapPin, Search } from 'lucide-react';
import { JobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { FilterSidebar } from '../components/FilterSidebar';
import { MapView } from '../components/MapView';

export const Jobs = () => {
  const { jobs, loading, filters, setFilters, fetchJobs } = useContext(JobContext);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header & View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Browse Nearby <span className="gradient-text">Part-Time Jobs</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Showing {jobs.length} active opportunities within your radius
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <LayoutGrid size={15} /> Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <MapPin size={15} /> Map Radar
          </button>
        </div>
      </div>

      {/* Main Layout Grid: Sidebar 280px + Content 1fr */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 280px) 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Filter Sidebar */}
        <div>
          <FilterSidebar />
        </div>

        {/* Right Job Content Area */}
        <div>
          {/* Quick Search Bar */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by job title, company, or neighborhood address..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && fetchJobs(filters)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button onClick={() => fetchJobs(filters)} className="btn btn-primary">
              Search
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading nearby shift opportunities...
            </div>
          ) : jobs.length === 0 ? (
            <div className="card-glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No shifts match your search criteria</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try broadening your search radius slider or changing category filters.</p>
              <button
                onClick={() => {
                  const resetF = { search: '', category: 'All', maxDistance: 300, minRate: 0, shiftTiming: 'All' };
                  setFilters(resetF);
                  fetchJobs(resetF);
                }}
                className="btn btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <MapView jobs={jobs} onSelectJob={j => setSelectedJob(j)} />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {jobs.map(job => (
                <JobCard key={job._id} job={job} onViewDetails={j => setSelectedJob(j)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};
