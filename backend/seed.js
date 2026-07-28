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
      bio: 'Recruiter at Local Cafe & Retail Networks in Kottayam Town.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const jobs = await Job.insertMany([
      {
        title: 'Weekend Barista & Counter Staff',
        company: 'Highland Roasters Cafe',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 250,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: 'Kanjikuzhy Junction, Kottayam Town',
        coordinates: { lat: 9.5916, lng: 76.5330 },
        distanceKm: 0.8,
        description: 'Looking for an energetic weekend barista to brew coffees, take guest orders, and assist store operations near Kanjikuzhy.',
        requirements: ['Basic beverage preparation', 'Communication in Malayalam/English', 'Punctual & polite'],
        perks: ['Free beverage per shift', 'Performance tips', 'Flexible weekend rosters'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Evening Retail Store Associate',
        company: 'Textile World Mart',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 220,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'Thirunakkara Bus Stand Road, Kottayam',
        coordinates: { lat: 9.5890, lng: 76.5210 },
        distanceKm: 1.2,
        description: 'Assist shoppers during peak evening hours, restock store displays, and manage customer checkout.',
        requirements: ['Friendly customer handling', 'Punctual attendance', 'Basic billing awareness'],
        perks: ['15% employee discount', 'Travel allowance for late evening shifts'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Express Parcel Delivery Partner',
        company: 'Kottayam Express Logistics',
        employer: employer._id,
        category: 'Delivery & Logistics',
        hourlyRate: 300,
        shiftTiming: 'Flexible',
        hoursPerWeek: 20,
        locationName: 'Collectorate Road, Kottayam Town',
        coordinates: { lat: 9.5950, lng: 76.5260 },
        distanceKm: 2.0,
        description: 'Deliver e-commerce parcels and local packages across Kottayam Town and nearby residential areas.',
        requirements: ['Two-wheeler or scooter with valid license', 'Smartphone with GPS navigation'],
        perks: ['Weekly direct bank payouts', 'Fuel allowance', 'Keep 100% of tips'],
        positionsAvailable: 5,
        status: 'active'
      },
      {
        title: 'Class 9-12 Physics & Maths Tutor',
        company: 'CMS Academic Tuition Hub',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 450,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: 'CMS College Road, Kottayam',
        coordinates: { lat: 9.5980, lng: 76.5180 },
        distanceKm: 2.8,
        description: 'Teach small batches of high school students in Mathematics & Physics with focus on Board Exam preparation.',
        requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations'],
        perks: ['High hourly payout', 'Quiet tuition center environment', 'Flexible shift timings'],
        positionsAvailable: 2,
        status: 'active'
      }
    ]);

    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      coverNote: 'I live nearby in Kottayam Town and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied'
    });

    console.log('Database seeded with Kottayam Town, Kerala listings & Rupee (₹) rates!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
