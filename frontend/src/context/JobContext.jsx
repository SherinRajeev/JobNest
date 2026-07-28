import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    maxDistance: 10,
    minRate: 0,
    shiftTiming: 'All'
  });

  const { user, updateUserSavedJobs } = useContext(AuthContext);

  const fetchJobs = async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (customFilters.search) params.append('search', customFilters.search);
      if (customFilters.category && customFilters.category !== 'All') params.append('category', customFilters.category);
      if (customFilters.shiftTiming && customFilters.shiftTiming !== 'All') params.append('shiftTiming', customFilters.shiftTiming);
      if (customFilters.maxDistance) params.append('maxDistance', customFilters.maxDistance);
      if (customFilters.minRate) params.append('minRate', customFilters.minRate);

      const { data } = await API.get(`/jobs?${params.toString()}`);
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleBookmark = async (jobId) => {
    if (!user) return alert('Please login to bookmark jobs.');
    try {
      const { data } = await API.post(`/jobs/${jobId}/save`);
      updateUserSavedJobs(data.savedJobs);
    } catch (err) {
      console.error('Toggle bookmark error:', err);
    }
  };

  const createJobPost = async (jobData) => {
    const { data } = await API.post('/jobs', jobData);
    setJobs(prev => [data, ...prev]);
    return data;
  };

  const applyJob = async (jobId, coverNote, availability, phone) => {
    const { data } = await API.post('/applications', { jobId, coverNote, availability, phone });
    return data;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        filters,
        setFilters,
        fetchJobs,
        toggleBookmark,
        createJobPost,
        applyJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
