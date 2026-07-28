import React, { useContext, useState } from 'react';
import { LayoutGrid, Map, Search, SlidersHorizontal } from 'lucide-react';
import { JobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { MapView } from '../components/MapView';
import { JobModal } from '../components/JobModal';

export const Jobs = () => {
  const { jobs, loading, filters, setFilters, fetchJobs } = useContext(JobContext);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSearchChange = (e) => {
    const searchVal = e.target.value;
    const updated = { ...filters, search: searchVal };
    setFilters(updated);
    fetchJobs(updated);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Browse Nearby <span className="gradient-text">Part-Time Jobs</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Showing {jobs.length} active opportunities within your radius</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '0.25rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <LayoutGrid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <Map size={16} /> Map Radar
            </button>
          </div>
        </div>
      </div>

      {/* Main Jobs Layout */}
      <div className="jobs-page-grid">
        <FilterSidebar filters={filters} setFilters={setFilters} onApply={updated => fetchJobs(updated)} />

        <main>
          {/* Top Search Input */}
          <div className="form-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <Search size={18} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by job title, company, or neighborhood address..."
              value={filters.search}
              onChange={handleSearchChange}
              className="form-control"
              style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '1rem' }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Loading nearby part-time listings...
            </div>
          ) : viewMode === 'map' ? (
            <MapView jobs={jobs} onSelectJob={j => setSelectedJob(j)} />
          ) : jobs.length === 0 ? (
            <div className="card-glass" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>No Jobs Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try expanding your distance radius or clearing your category filters.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} onViewDetails={j => setSelectedJob(j)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};
