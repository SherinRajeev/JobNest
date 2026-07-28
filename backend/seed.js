import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jobnest';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    const seeker = await User.create({
      name: 'Rohan Sharma',
      email: 'seeker@jobnest.com',
      password: passwordHash,
      role: 'seeker',
      phone: '+91 98765 43210',
      location: 'Indiranagar, Bengaluru',
      bio: 'College student looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });

    const employer = await User.create({
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: passwordHash,
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Koramangala, Bengaluru',
      bio: 'Operations Head at Artisan Roastery Cafe & Local Retail Network.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const jobs = await Job.insertMany([
      {
        title: 'Weekend Barista & Shift Associate',
        company: 'Third Wave Coffee',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 250,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: '100ft Road, Indiranagar, Bengaluru',
        coordinates: { lat: 12.9784, lng: 77.6408 },
        distanceKm: 0.8,
        description: 'Looking for an enthusiastic weekend barista to prepare espresso beverages, manage customer order flow, and assist store operations.',
        requirements: ['Basic coffee/beverage knowledge', 'Good communication in English/Kannada', 'Punctual & team-oriented'],
        perks: ['Free gourmet beverage per shift', 'Performance incentives', 'Flexible weekend rosters'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Evening Retail Store Representative',
        company: 'FabIndia Experience Center',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 200,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'Connaught Place, New Delhi',
        coordinates: { lat: 28.6315, lng: 77.2167 },
        distanceKm: 1.5,
        description: 'Assist walk-in store visitors with product inquiries, restock retail shelves, and manage checkout queues during peak evening hours.',
        requirements: ['Friendly customer interaction', 'Punctual attendance', 'Basic POS billing awareness'],
        perks: ['20% store employee discount', 'Travel allowance for late shifts'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Express Parcel Delivery Partner',
        company: 'Shadowfax Express',
        employer: employer._id,
        category: 'Delivery & Logistics',
        hourlyRate: 320,
        shiftTiming: 'Flexible',
        hoursPerWeek: 20,
        locationName: 'HSR Layout Sector 3, Bengaluru',
        coordinates: { lat: 12.9116, lng: 77.6389 },
        distanceKm: 2.2,
        description: 'Deliver e-commerce parcels and local packages within your assigned neighborhood hub using two-wheelers or e-bikes.',
        requirements: ['Valid DL / EV bike access', 'Smartphone with GPS navigation', 'Familiarity with neighborhood routes'],
        perks: ['Weekly payouts', 'Fuel/charge subsidy', 'Keep 100% of customer tips'],
        positionsAvailable: 5,
        status: 'active'
      },
      {
        title: 'Class 9-12 Mathematics Tutor',
        company: 'BrightAcademy Classes',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 450,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: 'Jubilee Hills, Hyderabad',
        coordinates: { lat: 17.4319, lng: 78.4074 },
        distanceKm: 3.1,
        description: 'Conduct small-group problem-solving sessions for high school students in Algebra, Trigonometry, and Board exam prep.',
        requirements: ['Strong math background (B.Sc / B.Tech pursuing)', 'Patient teaching approach'],
        perks: ['High hourly payout', 'Study material provided', 'Flexible shift timings'],
        positionsAvailable: 2,
        status: 'active'
      }
    ]);

    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      coverNote: 'I am a student at NIFT nearby and available every Saturday & Sunday.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied'
    });

    console.log('Database seeded with Rupee (₹) rates & Indian locations!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
