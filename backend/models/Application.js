import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    coverNote: {
      type: String,
      default: ''
    },
    availability: {
      type: String,
      default: 'Immediate'
    },
    phone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Hired', 'Rejected'],
      default: 'Applied'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
