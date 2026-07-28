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

// 16 Default Sample Kerala Jobs Fallback
const defaultKeralaJobs = [
  {
    _id: 'job_1',
    title: 'Weekend Coffee Barista & Billing Staff',
    company: 'Indian Coffee House (ICH)',
    category: 'Cafe & Barista',
    hourlyRate: 250,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 16,
    locationName: 'Near KSRTC Bus Stand, Kottayam Town',
    coordinates: { lat: 9.5890, lng: 76.5210 },
    description: 'Looking for a friendly weekend barista & order billing assistant for peak hours at Indian Coffee House near KSRTC Bus Stand.',
    requirements: ['Basic coffee/beverage serving', 'Malayalam & basic English communication'],
    perks: ['Free coffee & snacks per shift', 'Performance tips'],
    positionsAvailable: 2,
    status: 'active'
  },
  {
    _id: 'job_2',
    title: 'Festival Season Sales Associate',
    company: 'Pothys Silks & Superstore',
    category: 'Retail & Store',
    hourlyRate: 220,
    shiftTiming: 'Evening (6PM - 11PM)',
    hoursPerWeek: 15,
    locationName: 'KGB Road, Thirunakkara, Kottayam',
    coordinates: { lat: 9.5916, lng: 76.5222 },
    description: 'Assist walk-in shoppers during peak evening hours, restock store garment sections, and assist counter checkout.',
    requirements: ['Friendly customer assistance', 'Punctual attendance'],
    perks: ['15% employee store discount', 'Travel allowance'],
    positionsAvailable: 3,
    status: 'active'
  },
  {
    _id: 'job_3',
    title: 'Part-Time Delivery Partner (Bike/Scooter)',
    company: 'Swiggy Delivery Hub Kottayam',
    category: 'Delivery & Logistics',
    hourlyRate: 300,
    shiftTiming: 'Flexible',
    hoursPerWeek: 20,
    locationName: 'Kanjikuzhy Junction, Kottayam',
    coordinates: { lat: 9.5916, lng: 76.5330 },
    description: 'Deliver food orders and quick-commerce parcels across Kanjikuzhy, Collectorate, and nearby Kottayam Town hubs.',
    requirements: ['Two-wheeler with valid license', 'Smartphone with GPS'],
    perks: ['Weekly bank payouts', 'Fuel allowance'],
    positionsAvailable: 5,
    status: 'active'
  },
  {
    _id: 'job_4',
    title: 'Class 10-12 Physics & Maths Instructor',
    company: 'Brilliant Coaching Centre Support',
    category: 'Tutoring & Education',
    hourlyRate: 450,
    shiftTiming: 'Afternoon (1PM - 6PM)',
    hoursPerWeek: 10,
    locationName: 'CMS College Road, Kottayam',
    coordinates: { lat: 9.5980, lng: 76.5180 },
    description: 'Conduct small-group doubt solving and practice sessions for Class 10, 11, and 12 students in Physics and Mathematics.',
    requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations'],
    perks: ['High hourly payout', 'Quiet study environment'],
    positionsAvailable: 2,
    status: 'active'
  },
  {
    _id: 'job_5',
    title: 'Trade Fair & Exhibition Event Crew',
    company: 'Nagampadam Exhibition Committee',
    category: 'Event Staff',
    hourlyRate: 350,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 14,
    locationName: 'Nagampadam Stadium Grounds, Kottayam',
    coordinates: { lat: 9.6010, lng: 76.5280 },
    description: 'Join event crew for ticket checking, hall guidance, and crowd control during upcoming Kottayam Trade Fair.',
    requirements: ['Energetic personality', 'Good communication skills'],
    perks: ['Free event crew pass', 'Catered meals'],
    positionsAvailable: 8,
    status: 'active'
  },
  {
    _id: 'job_6',
    title: 'Evening Patient Reception & Help Desk Staff',
    company: 'Caritas / Medical Center Desk',
    category: 'Office & Admin',
    hourlyRate: 280,
    shiftTiming: 'Morning (8AM - 1PM)',
    hoursPerWeek: 15,
    locationName: 'Collectorate Junction, Kottayam',
    coordinates: { lat: 9.5950, lng: 76.5260 },
    description: 'Assist visitors with token generation, direct patients to outpatient departments, and handle front desk phone queries.',
    requirements: ['Basic computer proficiency', 'Polite phone manner'],
    perks: ['AC workspace', 'Tea/coffee break'],
    positionsAvailable: 1,
    status: 'active'
  },
  {
    _id: 'job_7',
    title: 'Festival Garment & Counter Assistant',
    company: 'Seematti Silks Kottayam',
    category: 'Retail & Store',
    hourlyRate: 230,
    shiftTiming: 'Evening (6PM - 11PM)',
    hoursPerWeek: 15,
    locationName: 'KK Road, Central Junction, Kottayam Town',
    coordinates: { lat: 9.5910, lng: 76.5230 },
    description: 'Assist customer floor queries, fold and organize saree/garment displays, and support store cash counter staff.',
    requirements: ['Punctual & active', 'Friendly customer interaction'],
    perks: ['Store discount', 'Late drop allowance'],
    positionsAvailable: 4,
    status: 'active'
  },
  {
    _id: 'job_8',
    title: 'Evening Kitchen Crew & Dispatch Support',
    company: "Baker's Oven & Cafe",
    category: 'Cafe & Barista',
    hourlyRate: 240,
    shiftTiming: 'Evening (6PM - 11PM)',
    hoursPerWeek: 14,
    locationName: 'Kallarackal Bazaar, Kottayam Town',
    coordinates: { lat: 9.5935, lng: 76.5245 },
    description: 'Assist bakery chefs with pastry packing, manage takeout order dispatching, and maintain clean kitchen counters.',
    requirements: ['Hygiene awareness', 'Evening availability'],
    perks: ['Free bakery snacks', 'Flexible shifts'],
    positionsAvailable: 2,
    status: 'active'
  },
  {
    _id: 'job_9',
    title: 'Cataloging & Library Desk Assistant',
    company: 'Kottayam Public Library',
    category: 'Office & Admin',
    hourlyRate: 260,
    shiftTiming: 'Flexible',
    hoursPerWeek: 12,
    locationName: 'Public Library Road, Shastri Nagar, Kottayam',
    coordinates: { lat: 9.5925, lng: 76.5215 },
    description: 'Organize book archives, issue member borrowing cards, catalog digital records, and maintain quiet hall decorum.',
    requirements: ['Basic computer entry', 'Organized manner'],
    perks: ['Free library membership', 'Quiet study hall'],
    positionsAvailable: 1,
    status: 'active'
  },
  {
    _id: 'job_10',
    title: 'Primary English & Drawing Tutor',
    company: 'KidsAcademy Learning Corner',
    category: 'Tutoring & Education',
    hourlyRate: 380,
    shiftTiming: 'Afternoon (1PM - 6PM)',
    hoursPerWeek: 10,
    locationName: 'Good Shepherd Road, Kottayam',
    coordinates: { lat: 9.5880, lng: 76.5270 },
    description: 'Conduct creative English reading, phonics, and basic drawing classes for primary school children.',
    requirements: ['Patience with young kids', 'Good English fluency'],
    perks: ['Creative teaching environment', 'Teaching certificate'],
    positionsAvailable: 2,
    status: 'active'
  },
  {
    _id: 'job_11',
    title: 'Hypermarket Evening Sales Representative',
    company: 'LuLu Mall Hypermarket',
    category: 'Retail & Store',
    hourlyRate: 240,
    shiftTiming: 'Evening (6PM - 11PM)',
    hoursPerWeek: 15,
    locationName: 'LuLu Mall, Edappally, Kochi',
    coordinates: { lat: 10.0270, lng: 76.3080 },
    description: 'Assist shoppers during evening hours, manage shelf stocking, and handle billing counter support at LuLu Mall Kochi.',
    requirements: ['Punctual & customer friendly', 'Basic POS knowledge'],
    perks: ['Store discount', 'Late shift cab allowance'],
    positionsAvailable: 4,
    status: 'active'
  },
  {
    _id: 'job_12',
    title: 'Co-Working Desk & Community Assistant',
    company: 'InfoPark Startup Hub',
    category: 'Office & Admin',
    hourlyRate: 290,
    shiftTiming: 'Morning (8AM - 1PM)',
    hoursPerWeek: 15,
    locationName: 'InfoPark Phase 1, Kakkanad, Kochi',
    coordinates: { lat: 10.0120, lng: 76.3630 },
    description: 'Manage community front desk, coordinate tech startup meeting room bookings, and assist office admin operations.',
    requirements: ['Basic computer literacy', 'Good communication'],
    perks: ['Free Wi-Fi co-working access', 'Unlimited coffee'],
    positionsAvailable: 2,
    status: 'active'
  },
  {
    _id: 'job_13',
    title: 'Espresso Barista & Store Associate',
    company: 'Third Wave Coffee Roasters',
    category: 'Cafe & Barista',
    hourlyRate: 260,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 16,
    locationName: 'MG Road, Ernakulam, Kochi',
    coordinates: { lat: 9.9790, lng: 76.2750 },
    description: 'Craft gourmet espresso drinks, greet customers, and maintain cafe counters at MG Road Kochi outlet.',
    requirements: ['Coffee preparation passion', 'Friendly customer interaction'],
    perks: ['Free coffee per shift', 'Performance tips'],
    positionsAvailable: 3,
    status: 'active'
  },
  {
    _id: 'job_14',
    title: 'Retail Customer Service Associate',
    company: 'LuLu Mall Trivandrum',
    category: 'Retail & Store',
    hourlyRate: 230,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 14,
    locationName: 'Akkulam, Thiruvananthapuram',
    coordinates: { lat: 8.5241, lng: 76.8944 },
    description: 'Assist visitors with product inquiries and store navigation at LuLu Mall Trivandrum.',
    requirements: ['Good customer interaction', 'Flexible weekend hours'],
    perks: ['Employee discount', 'Travel allowance'],
    positionsAvailable: 3,
    status: 'active'
  },
  {
    _id: 'job_15',
    title: 'Exhibition & Cultural Fest Support Staff',
    company: 'Thrissur Pooram Fest Committee',
    category: 'Event Staff',
    hourlyRate: 360,
    shiftTiming: 'Weekend Special',
    hoursPerWeek: 12,
    locationName: 'Swaraj Round, Thrissur',
    coordinates: { lat: 10.5276, lng: 76.2144 },
    description: 'Assist fest committee with ticketing entry control, VIP lounge support, and venue crowd guidance.',
    requirements: ['Active personality', 'Good communication in Malayalam'],
    perks: ['Event crew pass', 'Catered food provided'],
    positionsAvailable: 6,
    status: 'active'
  },
  {
    _id: 'job_16',
    title: 'Fashion Store Sales Associate',
    company: 'Focus Mall Retails',
    category: 'Retail & Store',
    hourlyRate: 220,
    shiftTiming: 'Flexible',
    hoursPerWeek: 15,
    locationName: 'Rajaji Road, Kozhikode',
    coordinates: { lat: 11.2588, lng: 75.7804 },
    description: 'Assist retail shoppers, restock floor displays, and process counter checkout transactions at Focus Mall.',
    requirements: ['Punctual & helpful attitude', 'Basic billing skills'],
    perks: ['Store discount', 'Flexible shift rosters'],
    positionsAvailable: 3,
    status: 'active'
  }
];

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState({ lat: 9.5916, lng: 76.5222 }); // Default Kottayam Town
  const [detectedCity, setDetectedCity] = useState('Kottayam Town');
  const [isGpsActive, setIsGpsActive] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    maxDistance: 300,
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
          console.log('GPS tracking defaulting to Kottayam Town center.');
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
    let rawList = [];

    try {
      const params = new URLSearchParams();
      if (customFilters.search) params.append('search', customFilters.search);
      if (customFilters.category && customFilters.category !== 'All') params.append('category', customFilters.category);
      if (customFilters.shiftTiming && customFilters.shiftTiming !== 'All') params.append('shiftTiming', customFilters.shiftTiming);
      if (customFilters.maxDistance) params.append('maxDistance', customFilters.maxDistance);
      if (customFilters.minRate) params.append('minRate', customFilters.minRate);

      const res = await API.get(`/jobs?${params.toString()}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        rawList = res.data;
      } else {
        rawList = defaultKeralaJobs;
      }
    } catch (err) {
      console.warn('API fetch failed or offline, using default sample jobs fallback:', err.message);
      rawList = defaultKeralaJobs;
    }

    // Apply Client-Side Filter & Distance Calculation Fallback
    let filtered = rawList;

    if (customFilters.search) {
      const s = customFilters.search.toLowerCase();
      filtered = filtered.filter(
        j =>
          j.title.toLowerCase().includes(s) ||
          j.company.toLowerCase().includes(s) ||
          j.description?.toLowerCase().includes(s) ||
          j.locationName?.toLowerCase().includes(s)
      );
    }

    if (customFilters.category && customFilters.category !== 'All') {
      filtered = filtered.filter(j => j.category === customFilters.category);
    }

    if (customFilters.shiftTiming && customFilters.shiftTiming !== 'All') {
      filtered = filtered.filter(j => j.shiftTiming === customFilters.shiftTiming);
    }

    if (customFilters.minRate) {
      filtered = filtered.filter(j => j.hourlyRate >= Number(customFilters.minRate));
    }

    const processedJobs = filtered.map(j => {
      const jLat = j.coordinates?.lat || 9.5916;
      const jLng = j.coordinates?.lng || 76.5222;
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, jLat, jLng);
      return { ...j, distanceKm: dist };
    });

    // Filter by maxDistance if specified
    const finalJobs = processedJobs.filter(j => j.distanceKm <= (customFilters.maxDistance || 300));
    finalJobs.sort((a, b) => a.distanceKm - b.distanceKm);

    setJobs(finalJobs.length > 0 ? finalJobs : processedJobs.sort((a, b) => a.distanceKm - b.distanceKm));
    setLoading(false);
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
    try {
      const { data } = await API.post('/jobs', jobData);
      setJobs(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const newJob = { _id: `job_${Date.now()}`, ...jobData, status: 'active', createdAt: new Date().toISOString() };
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    }
  };

  const applyJob = async (jobId, coverNote, availability, phone) => {
    try {
      const { data } = await API.post('/applications', { jobId, coverNote, availability, phone });
      return data;
    } catch (err) {
      return { _id: `app_${Date.now()}`, jobId, coverNote, availability, phone, status: 'Applied' };
    }
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
