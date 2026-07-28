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

// User Location: Kottayam Town Center (9.5916, 76.5222)
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
      savedJobs: ['job_1', 'job_3']
    },
    {
      _id: 'usr_employer_1',
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: '$2a$10$wN9F/9t6ZJ0d4aZ0g0g0g.1234567890abcdef',
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Kanjikuzhy, Kottayam',
      bio: 'Recruiter at Local Cafe & Retail Networks in Kottayam Town.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      savedJobs: []
    }
  ],
  jobs: [
    {
      _id: 'job_1',
      title: 'Weekend Barista & Counter Staff',
      company: 'Highland Roasters Cafe',
      employer: 'usr_employer_1',
      category: 'Cafe & Barista',
      hourlyRate: 250,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 16,
      locationName: 'Kanjikuzhy Junction, Kottayam Town',
      coordinates: { lat: 9.5916, lng: 76.5330 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5916, 76.5330),
      description: 'Looking for an energetic weekend barista to brew coffees, take guest orders, and assist store operations near Kanjikuzhy.',
      requirements: ['Basic beverage preparation', 'Communication in Malayalam/English', 'Punctual & polite'],
      perks: ['Free beverage per shift', 'Performance tips', 'Flexible weekend rosters'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_2',
      title: 'Evening Retail Store Associate',
      company: 'Textile World Mart',
      employer: 'usr_employer_1',
      category: 'Retail & Store',
      hourlyRate: 220,
      shiftTiming: 'Evening (6PM - 11PM)',
      hoursPerWeek: 15,
      locationName: 'Thirunakkara Bus Stand Road, Kottayam',
      coordinates: { lat: 9.5890, lng: 76.5210 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5890, 76.5210),
      description: 'Assist shoppers during peak evening hours, restock store displays, and manage customer checkout.',
      requirements: ['Friendly customer handling', 'Punctual attendance', 'Basic billing awareness'],
      perks: ['15% employee discount', 'Travel allowance for late evening shifts'],
      positionsAvailable: 3,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_3',
      title: 'Express Parcel Delivery Partner',
      company: 'Kottayam Express Logistics',
      employer: 'usr_employer_1',
      category: 'Delivery & Logistics',
      hourlyRate: 300,
      shiftTiming: 'Flexible',
      hoursPerWeek: 20,
      locationName: 'Collectorate Road, Kottayam Town',
      coordinates: { lat: 9.5950, lng: 76.5260 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5950, 76.5260),
      description: 'Deliver e-commerce parcels and local packages across Kottayam Town and nearby residential areas.',
      requirements: ['Two-wheeler or scooter with valid license', 'Smartphone with GPS navigation'],
      perks: ['Weekly direct bank payouts', 'Fuel allowance', 'Keep 100% of tips'],
      positionsAvailable: 5,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_4',
      title: 'Class 9-12 Physics & Maths Tutor',
      company: 'CMS Academic Tuition Hub',
      employer: 'usr_employer_1',
      category: 'Tutoring & Education',
      hourlyRate: 450,
      shiftTiming: 'Afternoon (1PM - 6PM)',
      hoursPerWeek: 10,
      locationName: 'CMS College Road, Kottayam',
      coordinates: { lat: 9.5980, lng: 76.5180 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5980, 76.5180),
      description: 'Teach small batches of high school students in Mathematics & Physics with focus on Board Exam preparation.',
      requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations'],
      perks: ['High hourly payout', 'Quiet tuition center environment', 'Flexible shift timings'],
      positionsAvailable: 2,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_5',
      title: 'Cultural Fest & Event Crew',
      company: 'Kottayam Youth Events',
      employer: 'usr_employer_1',
      category: 'Event Staff',
      hourlyRate: 350,
      shiftTiming: 'Weekend Special',
      hoursPerWeek: 14,
      locationName: 'Nehru Stadium Grounds, Kottayam',
      coordinates: { lat: 9.5850, lng: 76.5290 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.5850, 76.5290),
      description: 'Join event management crew for entry ticket checking, crowd coordination, and stage support during weekend fests.',
      requirements: ['Energetic personality', 'Good communication skills'],
      perks: ['Free event crew entry', 'Food & snacks provided', 'Event certificate'],
      positionsAvailable: 8,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job_6',
      title: 'Co-Working Desk & Reception Support',
      company: 'Nagampadam Office Hub',
      employer: 'usr_employer_1',
      category: 'Office & Admin',
      hourlyRate: 280,
      shiftTiming: 'Morning (8AM - 1PM)',
      hoursPerWeek: 15,
      locationName: 'Nagampadam Area, Kottayam',
      coordinates: { lat: 9.6010, lng: 76.5280 },
      distanceKm: calculateDistance(USER_LAT, USER_LNG, 9.6010, 76.5280),
      description: 'Manage morning visitor desk, assist members with conference room bookings, and support office administrative tasks.',
      requirements: ['Basic computer skills', 'Pleasant communication style'],
      perks: ['Free Wi-Fi co-working desk access', 'Unlimited coffee', 'Networking opportunities'],
      positionsAvailable: 1,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  applications: [
    {
      _id: 'app_1',
      job: 'job_1',
      applicant: 'usr_seeker_1',
      coverNote: 'I live nearby in Kottayam Town and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};
