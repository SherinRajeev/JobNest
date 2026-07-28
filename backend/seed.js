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
      location: 'Kottayam Town, Kerala',
      bio: 'College student in Kottayam looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });

    const employer = await User.create({
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: passwordHash,
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Kanjikuzhy, Kottayam',
      bio: 'Recruiter at Local Business & Retail Networks in Kottayam Town.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const jobs = await Job.insertMany([
      {
        title: 'Weekend Coffee Barista & Billing Staff',
        company: 'Indian Coffee House (ICH)',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 250,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: 'Near KSRTC Bus Stand, Kottayam Town',
        coordinates: { lat: 9.5890, lng: 76.5210 },
        distanceKm: 0.3,
        description: 'Looking for a friendly weekend barista & order billing assistant for peak hours at Indian Coffee House near KSRTC Bus Stand.',
        requirements: ['Basic coffee/beverage serving', 'Malayalam & basic English communication', 'Punctual & team-oriented'],
        perks: ['Free coffee & snacks per shift', 'Performance tips', 'Flexible weekend rosters'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Festival Season Sales Associate',
        company: 'Pothys Silks & Superstore',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 220,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'KGB Road, Thirunakkara, Kottayam',
        coordinates: { lat: 9.5916, lng: 76.5222 },
        distanceKm: 0.0,
        description: 'Assist walk-in shoppers during peak evening hours, restock store garment sections, and assist counter checkout at Pothys Kottayam.',
        requirements: ['Friendly customer assistance', 'Punctual attendance', 'Basic billing awareness'],
        perks: ['15% employee store discount', 'Travel allowance for late evening shifts'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Part-Time Delivery Partner (Bike/Scooter)',
        company: 'Swiggy Delivery Hub Kottayam',
        employer: employer._id,
        category: 'Delivery & Logistics',
        hourlyRate: 300,
        shiftTiming: 'Flexible',
        hoursPerWeek: 20,
        locationName: 'Kanjikuzhy Junction, Kottayam',
        coordinates: { lat: 9.5916, lng: 76.5330 },
        distanceKm: 1.2,
        description: 'Deliver food orders and quick-commerce parcels across Kanjikuzhy, Collectorate, and nearby Kottayam Town hubs.',
        requirements: ['Two-wheeler / scooter with valid license', 'Smartphone with GPS app'],
        perks: ['Weekly direct bank payouts', 'Fuel allowance', 'Keep 100% of tips'],
        positionsAvailable: 5,
        status: 'active'
      },
      {
        title: 'Class 10-12 Physics & Maths Instructor',
        company: 'Brilliant Coaching Centre Support',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 450,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: 'CMS College Road, Kottayam',
        coordinates: { lat: 9.5980, lng: 76.5180 },
        distanceKm: 0.8,
        description: 'Conduct small-group doubt solving and practice sessions for Class 10, 11, and 12 students in Physics and Mathematics.',
        requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations in Malayalam/English'],
        perks: ['High hourly payout', 'Quiet academic center environment', 'Flexible shift timings'],
        positionsAvailable: 2,
        status: 'active'
      }
    ]);

    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      coverNote: 'I live near KSRTC Bus Stand in Kottayam Town and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied'
    });

    console.log('Database seeded with real Kottayam business job listings!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
