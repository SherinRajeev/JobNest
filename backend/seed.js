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
      location: 'Marine Drive, Kochi, Kerala',
      bio: 'College student in Kochi looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });

    const employer = await User.create({
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: passwordHash,
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Panampilly Nagar, Kochi',
      bio: 'Recruiter at Artisan Brews & Retail Networks in Ernakulam, Kochi.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const jobs = await Job.insertMany([
      {
        title: 'Weekend Barista & Counter Staff',
        company: 'Cafe De Port',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 250,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: 'Marine Drive Walkway, Kochi',
        coordinates: { lat: 9.9790, lng: 76.2750 },
        distanceKm: 0.8,
        description: 'Looking for a friendly weekend barista to brew coffees, take guest orders, and maintain counter hygiene along Marine Drive.',
        requirements: ['Basic beverage preparation', 'Communication in Malayalam/English', 'Punctual & polite'],
        perks: ['Free gourmet beverage per shift', 'Performance tips', 'Flexible weekend rosters'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Evening Store Sales Representative',
        company: 'LuLu Hypermarket Store',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 220,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'LuLu Mall, Edappally, Kochi',
        coordinates: { lat: 10.0270, lng: 76.3080 },
        distanceKm: 1.5,
        description: 'Assist shoppers during peak evening hours, restock retail section displays, and assist customer checkout.',
        requirements: ['Friendly customer handling', 'Punctual attendance', 'Basic billing awareness'],
        perks: ['15% employee store discount', 'Travel allowance for late evening shifts'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Express Parcel Delivery Partner',
        company: 'Kochi Express Deliveries',
        employer: employer._id,
        category: 'Delivery & Logistics',
        hourlyRate: 300,
        shiftTiming: 'Flexible',
        hoursPerWeek: 20,
        locationName: 'InfoPark Road, Kakkanad, Kochi',
        coordinates: { lat: 10.0100, lng: 76.3600 },
        distanceKm: 2.2,
        description: 'Deliver e-commerce parcels and local document packages across Kakkanad and InfoPark tech zones.',
        requirements: ['Two-wheeler or scooter with valid license', 'Smartphone with GPS app'],
        perks: ['Weekly direct bank payouts', 'Fuel allowance', 'Keep 100% of tips'],
        positionsAvailable: 5,
        status: 'active'
      },
      {
        title: 'Class 9-12 Physics & Maths Tutor',
        company: 'Panampilly Learning Hub',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 450,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: 'Main Avenue, Panampilly Nagar, Kochi',
        coordinates: { lat: 9.9620, lng: 76.2930 },
        distanceKm: 3.0,
        description: 'Teach small batches of high school students in Mathematics & Physics with focus on Board Exam preparation.',
        requirements: ['B.Tech / B.Sc student or graduate', 'Clear concept explanations'],
        perks: ['High hourly payout', 'Quiet study center environment', 'Flexible shift timings'],
        positionsAvailable: 2,
        status: 'active'
      }
    ]);

    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      coverNote: 'I live nearby on Marine Drive and available for weekend shifts.',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+91 98765 43210',
      status: 'Applied'
    });

    console.log('Database seeded with Kochi, Kerala listings & Rupee (₹) rates!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
