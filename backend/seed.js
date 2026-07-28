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
      name: 'Alex Johnson',
      email: 'seeker@jobnest.com',
      password: passwordHash,
      role: 'seeker',
      phone: '+1 (555) 234-5678',
      location: 'Downtown Core',
      bio: 'Energetic college student seeking flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    const employer = await User.create({
      name: 'Sarah Miller',
      email: 'employer@jobnest.com',
      password: passwordHash,
      role: 'employer',
      phone: '+1 (555) 987-6543',
      location: 'Metro District',
      bio: 'Hiring Manager at Artisan Brews Cafe & Local Retail Network.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const jobs = await Job.insertMany([
      {
        title: 'Weekend Barista & Shift Support',
        company: 'Artisan Brews Cafe',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 18.50,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: '742 Evergreen Terrace, Downtown',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        distanceKm: 0.8,
        description: 'We are seeking a friendly weekend barista to craft espresso drinks, greet guests, and maintain counter cleanliness. Great tips!',
        requirements: ['Basic espresso machine knowledge', 'Customer service oriented', 'Punctual & team player'],
        perks: ['Free gourmet coffee & meal', 'Weekly cash tips', 'Flexible scheduling'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Evening Retail Store Associate',
        company: 'Urban Threads Clothing',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 16.75,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 12,
        locationName: '120 Market Street, Shopping District',
        coordinates: { lat: 40.7180, lng: -73.9980 },
        distanceKm: 1.5,
        description: 'Assist customers with apparel fitting, restock floor displays, and process checkout transactions during evening hours.',
        requirements: ['No prior experience required', 'Friendly communication skills', 'Ability to lift 15 lbs'],
        perks: ['30% employee discount', 'Bus pass stipend'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Express Courier & Parcel Deliverer',
        company: 'SwiftPace Logistics',
        employer: employer._id,
        category: 'Delivery & Logistics',
        hourlyRate: 21.00,
        shiftTiming: 'Flexible',
        hoursPerWeek: 20,
        locationName: '88 Commerce Way, North Hub',
        coordinates: { lat: 40.7250, lng: -74.0120 },
        distanceKm: 2.3,
        description: 'Deliver lightweight e-commerce packages across nearby neighborhood zones. Bicycle or e-scooter provided if needed!',
        requirements: ['Valid driving license or reliable bike', 'Navigation smartphone', 'Punctual delivery track record'],
        perks: ['Keep 100% of tips', 'Performance bonuses', 'Pick your own hours'],
        positionsAvailable: 5,
        status: 'active'
      },
      {
        title: 'High School Math & Science Tutor',
        company: 'BrightMind Academy',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 25.00,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: '310 Academic Lane, Campus Quarter',
        coordinates: { lat: 40.7050, lng: -74.0150 },
        distanceKm: 3.1,
        description: 'Tutor 9th-12th graders in Algebra, Calculus, and Physics in one-on-one or small group sessions.',
        requirements: ['Strong math background', 'Patient teaching style', 'Minimum 3.5 GPA'],
        perks: ['High hourly pay', 'Quiet environment', 'Certificate of teaching hours'],
        positionsAvailable: 2,
        status: 'active'
      }
    ]);

    await Application.create({
      job: jobs[0]._id,
      applicant: seeker._id,
      coverNote: 'I have 1 year of barista experience and live just 5 minutes away!',
      availability: 'Immediate (Saturdays & Sundays)',
      phone: '+1 (555) 234-5678',
      status: 'Applied'
    });

    console.log('Database seeded successfully!');
    console.log('Demo Credentials:');
    console.log('Seeker: seeker@jobnest.com / password123');
    console.log('Employer: employer@jobnest.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
