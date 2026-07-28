import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

export const JobContext = createContext();

// Real Geodesic Haversine Distance Calculation Helper (in Kilometers)
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 9.5916, lng: 76.5222 }); // Default Kottayam Town
  const [detectedCity, setDetectedCity] = useState('Kottayam Town');
  const [isGpsActive, setIsGpsActive] = useState(false);

  // Set default maxDistance to 250km so ALL jobs across Kerala display by default
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    maxDistance: 250,
    minRate: 0,
    shiftTiming: 'All'
  });

  const { user, updateUserSavedJobs } = useContext(AuthContext);

  // Auto-track Visitor's Live GPS Location
  const trackUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setIsGpsActive(true);

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const townName = data.address?.town || data.address?.city || data.address?.suburb || data.address?.county || 'Your Area';
            setDetectedCity(townName);
          } catch (e) {
            setDetectedCity('Live Location');
          }
        },
        (error) => {
          console.log('GPS tracking using Kottayam Town center.');
          setIsGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  useEffect(() => {
    trackUserLocation();
  }, []);

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

      // Calculate real distances based on visitor's live GPS coordinates & sort by proximity
      const processedJobs = (data || []).map(j => {
        const jLat = j.coordinates?.lat || 9.5916;
        const jLng = j.coordinates?.lng || 76.5222;
        const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, jLat, jLng);
        return { ...j, distanceKm: dist };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      setJobs(processedJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userCoords]);

  const toggleBookmark = async (jobId) => {
    if (!user) return alert('Please login as an Applicant to bookmark shifts.');
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
        userCoords,
        detectedCity,
        isGpsActive,
        trackUserLocation,
        toggleBookmark,
        createJobPost,
        applyJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
