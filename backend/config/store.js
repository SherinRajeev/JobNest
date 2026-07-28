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

// User Location Center: Kottayam Town Center (9.5916, 76.5222)
const USER_LAT = 9.5916;
const USER_LNG = 76.5222;

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
      coordinates: { lat: USER_LAT, lng: USER_LNG },
      bio: 'College student in Kottayam looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      savedJobs: ['job_1', 'job_3', 'job_7']
    },
    {
      _id: 'usr_employer_1',
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: '$2a$10$wN9F/9t6ZJ0d4aZ0g0g0g.1234567890abcdef',
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Kanjikuzhy, Kottayam',
      bio: 'Recruiter at Local Business & Retail Networks in Kottayam Town.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      savedJobs: []
    }
  ],
  jobs: [
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5890, 76.5210),
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5916, 76.5222),
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5916, 76.5330),
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5980, 76.5180),
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.6010, 76.5280),
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
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5950, 76.5260),
      description: 'Assist visitors with token generation, direct patients to outpatient departments, and handle front desk phone queries.',
      requirements: ['Basic computer proficiency', 'Polite phone manner & patient assistance'],
      perks: ['Clean air-conditioned workspace', 'Tea/coffee break provided', 'Certificate of hospital admin experience'],
      positionsAvailable: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_7',
      title: 'Festival Garment & Counter Assistant',
      company: 'Seematti Silks Kottayam',
      employer: 'usr_employer_1',
      category: 'Retail & Store',
      hourlyRate: 230,
      shiftTiming: 'Evening (6PM - 11PM)',
      hoursPerWeek: 15,
      locationName: 'KK Road, Central Junction, Kottayam Town',
      coordinates: { lat: 9.5910, lng: 76.5230 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5910, 76.5230),
      description: 'Assist customer floor queries, fold and organize saree/garment displays, and support store cash counter staff during busy evening hours.',
      requirements: ['Punctual & active', 'Friendly customer interaction'],
      perks: ['Store discount', 'Late evening drop allowance'],
      positionsAvailable: 4,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_8',
      title: 'Evening Kitchen Crew & Dispatch Support',
      company: "Baker's Oven & Cafe",
      employer: 'usr_employer_1',
      category: 'Cafe & Barista',
      hourlyRate: 240,
      shiftTiming: 'Evening (6PM - 11PM)',
      hoursPerWeek: 14,
      locationName: 'Kallarackal Bazaar, Kottayam Town',
      coordinates: { lat: 9.5935, lng: 76.5245 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5935, 76.5245),
      description: 'Assist bakery chefs with pastry packing, manage takeout order dispatching, and maintain clean kitchen counters.',
      requirements: ['Food safety & hygiene awareness', 'Ability to work evening shifts'],
      perks: ['Complimentary bakery snacks', 'Flexible shift scheduling'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_9',
      title: 'Cataloging & Library Desk Assistant',
      company: 'Kottayam Public Library',
      employer: 'usr_employer_1',
      category: 'Office & Admin',
      hourlyRate: 260,
      shiftTiming: 'Flexible',
      hoursPerWeek: 12,
      locationName: 'Public Library Road, Shastri Nagar, Kottayam',
      coordinates: { lat: 9.5925, lng: 76.5215 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5925, 76.5215),
      description: 'Organize book archives, issue member borrowing cards, catalog digital records, and maintain quiet reading hall decorum.',
      requirements: ['Basic computer entry', 'Organized and meticulous manner'],
      perks: ['Free library membership', 'Quiet study environment'],
      positionsAvailable: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_10',
      title: 'Primary English & Drawing Tutor',
      company: 'KidsAcademy Learning Corner',
      employer: 'usr_employer_1',
      category: 'Tutoring & Education',
      hourlyRate: 380,
      shiftTiming: 'Afternoon (1PM - 6PM)',
      hoursPerWeek: 10,
      locationName: 'Good Shepherd Road, Kottayam',
      coordinates: { lat: 9.5880, lng: 76.5270 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5880, 76.5270),
      description: 'Conduct creative English reading, phonics, and basic drawing classes for primary school children (Classes 1-5).',
      requirements: ['Patience with young kids', 'Good English handwriting & fluency'],
      perks: ['Creative teaching environment', 'Teaching certificate'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  applications: [
    {
      _id: 'app_1',
      job: 'job_1',
      applicant: 'usr_seeker_1',
      coverNote: 'I live near KSRTC Bus Stand in Kottayam Town and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};
