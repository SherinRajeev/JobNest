// Real Geodesic Haversine Distance Helper (in Kilometers)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

// Default Kottayam Coordinates (9.5916, 76.5222)
const KOTTAYAM_LAT = 9.5916;
const KOTTAYAM_LNG = 76.5222;

export const memoryStore = {
  users: [
    {
      _id: 'usr_seeker_1',
      name: 'Rohan Sharma',
      email: 'seeker@jobnest.com',
      password: '$2a$10$wN9F/9t6ZJ0d4aZ0g0g0g.1234567890abcdef',
      role: 'seeker',
      phone: '+91 98765 43210',
      location: 'Kottayam Town, Kerala',
      coordinates: { lat: KOTTAYAM_LAT, lng: KOTTAYAM_LNG },
      bio: 'College student looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      savedJobs: ['job_1', 'job_3']
    },
    {
      _id: 'usr_employer_1',
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: '$2a$10$wN9F/9t6ZJ0d4aZ0g0g0g.1234567890abcdef',
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Panampilly Nagar, Kochi',
      bio: 'Recruiter at Local Business & Retail Networks in Kerala.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      savedJobs: []
    }
  ],
  jobs: [
    // Kottayam Town Listings
    {
      _id: 'job_1',
      title: 'Weekend Coffee Barista & Billing Staff',
      company: 'Indian Coffee House (ICH)',
      employer: 'usr_employer_1',
      category: 'Cafe & Barista',
      hourlyRate: 250,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 16,
      locationName: 'Near KSRTC Bus Stand, Kottayam Town',
      coordinates: { lat: 9.5890, lng: 76.5210 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.5890, 76.5210),
      description: 'Looking for a friendly weekend barista & order billing assistant for peak hours at Indian Coffee House near KSRTC Bus Stand.',
      requirements: ['Basic coffee/beverage serving', 'Malayalam & basic English communication', 'Punctual & team-oriented'],
      perks: ['Free coffee & snacks per shift', 'Performance tips', 'Flexible weekend rosters'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_2',
      title: 'Festival Season Sales Associate',
      company: 'Pothys Silks & Superstore',
      employer: 'usr_employer_1',
      category: 'Retail & Store',
      hourlyRate: 220,
      shiftTiming: 'Evening (6PM - 11PM)',
      hoursPerWeek: 15,
      locationName: 'KGB Road, Thirunakkara, Kottayam',
      coordinates: { lat: 9.5916, lng: 76.5222 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.5916, 76.5222),
      description: 'Assist walk-in shoppers during peak evening hours, restock store garment sections, and assist counter checkout at Pothys Kottayam.',
      requirements: ['Friendly customer assistance', 'Punctual attendance', 'Basic billing awareness'],
      perks: ['15% employee store discount', 'Travel allowance for late evening shifts'],
      positionsAvailable: 3,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_3',
      title: 'Part-Time Delivery Partner (Bike/Scooter)',
      company: 'Swiggy Delivery Hub Kottayam',
      employer: 'usr_employer_1',
      category: 'Delivery & Logistics',
      hourlyRate: 300,
      shiftTiming: 'Flexible',
      hoursPerWeek: 20,
      locationName: 'Kanjikuzhy Junction, Kottayam',
      coordinates: { lat: 9.5916, lng: 76.5330 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.5916, 76.5330),
      description: 'Deliver food orders and quick-commerce parcels across Kanjikuzhy, Collectorate, and nearby Kottayam Town hubs.',
      requirements: ['Two-wheeler / scooter with valid license', 'Smartphone with GPS app'],
      perks: ['Weekly direct bank payouts', 'Fuel allowance', 'Keep 100% of tips'],
      positionsAvailable: 5,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_4',
      title: 'Class 10-12 Physics & Maths Instructor',
      company: 'Brilliant Coaching Centre Support',
      employer: 'usr_employer_1',
      category: 'Tutoring & Education',
      hourlyRate: 450,
      shiftTiming: 'Afternoon (1PM - 6PM)',
      hoursPerWeek: 10,
      locationName: 'CMS College Road, Kottayam',
      coordinates: { lat: 9.5980, lng: 76.5180 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.5980, 76.5180),
      description: 'Conduct small-group doubt solving and practice sessions for Class 10, 11, and 12 students in Physics and Mathematics.',
      requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations in Malayalam/English'],
      perks: ['High hourly payout', 'Quiet academic center environment', 'Flexible shift timings'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_5',
      title: 'Trade Fair & Exhibition Event Crew',
      company: 'Nagampadam Exhibition Committee',
      employer: 'usr_employer_1',
      category: 'Event Staff',
      hourlyRate: 350,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 14,
      locationName: 'Nagampadam Stadium Grounds, Kottayam',
      coordinates: { lat: 9.6010, lng: 76.5280 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.6010, 76.5280),
      description: 'Join event crew for ticket checking, hall guidance, and crowd control during upcoming Kottayam Trade Fair & Flower Show.',
      requirements: ['Energetic personality', 'Good communication skills'],
      perks: ['Free event crew pass', 'Catered food & snacks', 'Official event certificate'],
      positionsAvailable: 8,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_6',
      title: 'Evening Patient Reception & Help Desk Staff',
      company: 'Caritas / Medical Center Desk',
      employer: 'usr_employer_1',
      category: 'Office & Admin',
      hourlyRate: 280,
      shiftTiming: 'Morning (8AM - 1PM)',
      hoursPerWeek: 15,
      locationName: 'Collectorate Junction, Kottayam',
      coordinates: { lat: 9.5950, lng: 76.5260 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 9.5950, 76.5260),
      description: 'Assist visitors with token generation, direct patients to outpatient departments, and handle front desk phone queries.',
      requirements: ['Basic computer proficiency', 'Polite phone manner & patient assistance'],
      perks: ['Clean air-conditioned workspace', 'Tea/coffee break provided', 'Certificate of hospital admin experience'],
      positionsAvailable: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    // Kochi Listings
    {
      _id: 'job_7',
      title: 'Hypermarket Evening Sales Associate',
      company: 'LuLu Mall Hypermarket',
      employer: 'usr_employer_1',
      category: 'Retail & Store',
      hourlyRate: 240,
      shiftTiming: 'Evening (6PM - 11PM)',
      hoursPerWeek: 15,
      locationName: 'Edappally, Kochi, Kerala',
      coordinates: { lat: 10.0270, lng: 76.3080 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 10.0270, 76.3080),
      description: 'Assist shoppers during evening hours, manage shelf stocking, and handle billing counter support at LuLu Mall Kochi.',
      requirements: ['Punctual & customer friendly', 'Basic POS billing knowledge'],
      perks: ['Store discount', 'Late shift cab allowance'],
      positionsAvailable: 4,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_8',
      title: 'Co-Working Community Desk Executive',
      company: 'InfoPark Co-Working Hub',
      employer: 'usr_employer_1',
      category: 'Office & Admin',
      hourlyRate: 290,
      shiftTiming: 'Morning (8AM - 1PM)',
      hoursPerWeek: 15,
      locationName: 'Kakkanad InfoPark, Kochi',
      coordinates: { lat: 10.0120, lng: 76.3630 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 10.0120, 76.3630),
      description: 'Manage community front desk, coordinate tech startup meeting room bookings, and assist office admin operations.',
      requirements: ['Basic computer literacy', 'Good communication skills'],
      perks: ['Free Wi-Fi co-working access', 'Unlimited coffee'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    // Thiruvananthapuram Listings
    {
      _id: 'job_9',
      title: 'Retail Brand Customer Assistant',
      company: 'LuLu Mall Trivandrum',
      employer: 'usr_employer_1',
      category: 'Retail & Store',
      hourlyRate: 230,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 14,
      locationName: 'Akkulam, Thiruvananthapuram',
      coordinates: { lat: 8.5241, lng: 76.8944 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 8.5241, 76.8944),
      description: 'Assist visitors with product queries and store navigation at LuLu Mall Trivandrum.',
      requirements: ['Good customer interaction', 'Flexible weekend hours'],
      perks: ['Employee discount', 'Travel allowance'],
      positionsAvailable: 3,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    // Kozhikode & Thrissur Listings
    {
      _id: 'job_10',
      title: 'Tech Fest & Expo Support Crew',
      company: 'Focus Mall Event Committee',
      employer: 'usr_employer_1',
      category: 'Event Staff',
      hourlyRate: 320,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 12,
      locationName: 'Rajaji Road, Kozhikode',
      coordinates: { lat: 11.2588, lng: 75.7804 },
      distanceKm: calculateDistance(KOTTAYAM_LAT, KOTTAYAM_LNG, 11.2588, 75.7804),
      description: 'Support event registration, ticketing, and hall management during Kozhikode Tech & Trade Fest.',
      requirements: ['Active personality', 'Malayalam & English fluency'],
      perks: ['Event crew pass', 'Catered meals'],
      positionsAvailable: 5,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  applications: [
    {
      _id: 'app_1',
      job: 'job_1',
      applicant: 'usr_seeker_1',
      coverNote: 'I live near KSRTC Bus Stand and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};
