import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Cafe & Barista', 'Retail & Store', 'Delivery & Logistics', 'Tutoring & Education', 'Event Staff', 'Office & Admin', 'Customer Support', 'Other']
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required']
    },
    shiftTiming: {
      type: String,
      enum: ['Flexible', 'Morning (8AM - 1PM)', 'Afternoon (1PM - 6PM)', 'Evening (6PM - 11PM)', 'Weekend Special'],
      default: 'Flexible'
    },
    hoursPerWeek: {
      type: Number,
      default: 15
    },
    locationName: {
      type: String,
      required: [true, 'Location name is required']
    },
    coordinates: {
      lat: { type: Number, required: true, default: 40.7128 },
      lng: { type: Number, required: true, default: -74.0060 }
    },
    distanceKm: {
      type: Number,
      default: 1.2
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    requirements: [String],
    perks: [String],
    positionsAvailable: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'filled', 'closed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
