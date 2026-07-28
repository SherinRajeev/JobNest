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
      bio: 'College student looking for flexible weekend & evening part-time shifts.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });

    const employer = await User.create({
      name: 'Priya Nair',
      email: 'employer@jobnest.com',
      password: passwordHash,
      role: 'employer',
      phone: '+91 91234 56789',
      location: 'Kanjikuzhy, Kottayam',
      bio: 'Recruiter at Local Business & Retail Networks in Kerala.',
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
      },
      {
        title: 'Trade Fair & Exhibition Event Crew',
        company: 'Nagampadam Exhibition Committee',
        employer: employer._id,
        category: 'Event Staff',
        hourlyRate: 350,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 14,
        locationName: 'Nagampadam Stadium Grounds, Kottayam',
        coordinates: { lat: 9.6010, lng: 76.5280 },
        distanceKm: 1.2,
        description: 'Join event crew for ticket checking, hall guidance, and crowd control during upcoming Kottayam Trade Fair & Flower Show.',
        requirements: ['Energetic personality', 'Good communication skills'],
        perks: ['Free event crew pass', 'Catered food & snacks', 'Official event certificate'],
        positionsAvailable: 8,
        status: 'active'
      },
      {
        title: 'Evening Patient Reception & Help Desk Staff',
        company: 'Caritas / Medical Center Desk',
        employer: employer._id,
        category: 'Office & Admin',
        hourlyRate: 280,
        shiftTiming: 'Morning (8AM - 1PM)',
        hoursPerWeek: 15,
        locationName: 'Collectorate Junction, Kottayam',
        coordinates: { lat: 9.5950, lng: 76.5260 },
        distanceKm: 0.6,
        description: 'Assist visitors with token generation, direct patients to outpatient departments, and handle front desk phone queries.',
        requirements: ['Basic computer proficiency', 'Polite phone manner & patient assistance'],
        perks: ['Clean air-conditioned workspace', 'Tea/coffee break provided', 'Certificate of hospital admin experience'],
        positionsAvailable: 1,
        status: 'active'
      },
      {
        title: 'Festival Garment & Counter Assistant',
        company: 'Seematti Silks Kottayam',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 230,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'KK Road, Central Junction, Kottayam Town',
        coordinates: { lat: 9.5910, lng: 76.5230 },
        distanceKm: 0.1,
        description: 'Assist customer floor queries, fold and organize saree/garment displays, and support store cash counter staff during busy evening hours.',
        requirements: ['Punctual & active', 'Friendly customer interaction'],
        perks: ['Store discount', 'Late evening drop allowance'],
        positionsAvailable: 4,
        status: 'active'
      },
      {
        title: 'Evening Kitchen Crew & Dispatch Support',
        company: "Baker's Oven & Cafe",
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 240,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 14,
        locationName: 'Kallarackal Bazaar, Kottayam Town',
        coordinates: { lat: 9.5935, lng: 76.5245 },
        distanceKm: 0.3,
        description: 'Assist bakery chefs with pastry packing, manage takeout order dispatching, and maintain clean kitchen counters.',
        requirements: ['Food safety & hygiene awareness', 'Ability to work evening shifts'],
        perks: ['Complimentary bakery snacks', 'Flexible shift scheduling'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Cataloging & Library Desk Assistant',
        company: 'Kottayam Public Library',
        employer: employer._id,
        category: 'Office & Admin',
        hourlyRate: 260,
        shiftTiming: 'Flexible',
        hoursPerWeek: 12,
        locationName: 'Public Library Road, Shastri Nagar, Kottayam',
        coordinates: { lat: 9.5925, lng: 76.5215 },
        distanceKm: 0.1,
        description: 'Organize book archives, issue member borrowing cards, catalog digital records, and maintain quiet reading hall decorum.',
        requirements: ['Basic computer entry', 'Organized and meticulous manner'],
        perks: ['Free library membership', 'Quiet study environment'],
        positionsAvailable: 1,
        status: 'active'
      },
      {
        title: 'Primary English & Drawing Tutor',
        company: 'KidsAcademy Learning Corner',
        employer: employer._id,
        category: 'Tutoring & Education',
        hourlyRate: 380,
        shiftTiming: 'Afternoon (1PM - 6PM)',
        hoursPerWeek: 10,
        locationName: 'Good Shepherd Road, Kottayam',
        coordinates: { lat: 9.5880, lng: 76.5270 },
        distanceKm: 0.7,
        description: 'Conduct creative English reading, phonics, and basic drawing classes for primary school children (Classes 1-5).',
        requirements: ['Patience with young kids', 'Good English handwriting & fluency'],
        perks: ['Creative teaching environment', 'Teaching certificate'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Hypermarket Evening Sales Representative',
        company: 'LuLu Mall Hypermarket',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 240,
        shiftTiming: 'Evening (6PM - 11PM)',
        hoursPerWeek: 15,
        locationName: 'LuLu Mall, Edappally, Kochi',
        coordinates: { lat: 10.0270, lng: 76.3080 },
        distanceKm: 55.4,
        description: 'Assist shoppers during evening hours, manage shelf stocking, and handle billing counter support at LuLu Mall Kochi.',
        requirements: ['Punctual & customer friendly', 'Basic POS billing knowledge'],
        perks: ['Store discount', 'Late shift cab allowance'],
        positionsAvailable: 4,
        status: 'active'
      },
      {
        title: 'Co-Working Desk & Community Assistant',
        company: 'InfoPark Startup Hub',
        employer: employer._id,
        category: 'Office & Admin',
        hourlyRate: 290,
        shiftTiming: 'Morning (8AM - 1PM)',
        hoursPerWeek: 15,
        locationName: 'InfoPark Phase 1, Kakkanad, Kochi',
        coordinates: { lat: 10.0120, lng: 76.3630 },
        distanceKm: 58.2,
        description: 'Manage community front desk, coordinate tech startup meeting room bookings, and assist office admin operations.',
        requirements: ['Basic computer literacy', 'Good communication skills'],
        perks: ['Free Wi-Fi co-working access', 'Unlimited coffee'],
        positionsAvailable: 2,
        status: 'active'
      },
      {
        title: 'Espresso Barista & Store Associate',
        company: 'Third Wave Coffee Roasters',
        employer: employer._id,
        category: 'Cafe & Barista',
        hourlyRate: 260,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 16,
        locationName: 'MG Road, Ernakulam, Kochi',
        coordinates: { lat: 9.9790, lng: 76.2750 },
        distanceKm: 51.0,
        description: 'Craft gourmet espresso drinks, greet customers, and maintain cafe counters at MG Road Kochi outlet.',
        requirements: ['Coffee preparation passion', 'Friendly customer interaction'],
        perks: ['Free coffee per shift', 'Performance tips'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Retail Customer Service Associate',
        company: 'LuLu Mall Trivandrum',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 230,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 14,
        locationName: 'Akkulam, Thiruvananthapuram',
        coordinates: { lat: 8.5241, lng: 76.8944 },
        distanceKm: 124.5,
        description: 'Assist visitors with product inquiries and store navigation at LuLu Mall Trivandrum.',
        requirements: ['Good customer interaction', 'Flexible weekend hours'],
        perks: ['Employee discount', 'Travel allowance'],
        positionsAvailable: 3,
        status: 'active'
      },
      {
        title: 'Exhibition & Cultural Fest Support Staff',
        company: 'Thrissur Pooram Fest Committee',
        employer: employer._id,
        category: 'Event Staff',
        hourlyRate: 360,
        shiftTiming: 'Weekend Special',
        hoursPerWeek: 12,
        locationName: 'Swaraj Round, Thrissur',
        coordinates: { lat: 10.5276, lng: 76.2144 },
        distanceKm: 108.0,
        description: 'Assist fest committee with ticketing entry control, VIP lounge support, and venue crowd guidance.',
        requirements: ['Active personality', 'Good communication in Malayalam'],
        perks: ['Event crew pass', 'Catered food provided'],
        positionsAvailable: 6,
        status: 'active'
      },
      {
        title: 'Fashion Store Sales Associate',
        company: 'Focus Mall Retails',
        employer: employer._id,
        category: 'Retail & Store',
        hourlyRate: 220,
        shiftTiming: 'Flexible',
        hoursPerWeek: 15,
        locationName: 'Rajaji Road, Kozhikode',
        coordinates: { lat: 11.2588, lng: 75.7804 },
        distanceKm: 202.0,
        description: 'Assist retail shoppers, restock floor displays, and process counter checkout transactions at Focus Mall.',
        requirements: ['Punctual & helpful attitude', 'Basic billing skills'],
        perks: ['Store discount', 'Flexible shift rosters'],
        positionsAvailable: 3,
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

    console.log('Database seeded with 16 Kerala business job listings!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
