import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { memoryStore } from '../config/store.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverNote, availability, phone } = req.body;
    const userId = req.user.id || req.user._id;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    if (req.dbConnected) {
      const existing = await Application.findOne({ job: jobId, applicant: userId });
      if (existing) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      const application = await Application.create({
        job: jobId,
        applicant: userId,
        coverNote: coverNote || '',
        availability: availability || 'Immediate',
        phone: phone || req.user.phone || ''
      });

      return res.status(201).json(application);
    } else {
      const existing = memoryStore.applications.find(a => a.job === jobId && a.applicant === userId);
      if (existing) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      const newApp = {
        _id: `app_${Date.now()}`,
        job: jobId,
        applicant: userId,
        coverNote: coverNote || '',
        availability: availability || 'Immediate',
        phone: phone || req.user.phone || '',
        status: 'Applied',
        createdAt: new Date().toISOString()
      };

      memoryStore.applications.unshift(newApp);
      return res.status(201).json(newApp);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const apps = await Application.find({ applicant: userId })
        .populate('job')
        .sort({ createdAt: -1 });
      return res.json(apps);
    } else {
      const userApps = memoryStore.applications
        .filter(a => a.applicant === userId)
        .map(a => {
          const jobDetails = memoryStore.jobs.find(j => j._id === a.job);
          return {
            ...a,
            job: jobDetails || { title: 'Unknown Job', company: 'Unknown', hourlyRate: 0 }
          };
        });
      return res.json(userApps);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const employerJobs = await Job.find({ employer: userId }).select('_id');
      const jobIds = employerJobs.map(j => j._id);

      const apps = await Application.find({ job: { $in: jobIds } })
        .populate('job', 'title company category hourlyRate locationName')
        .populate('applicant', 'name email phone location bio avatar')
        .sort({ createdAt: -1 });

      return res.json(apps);
    } else {
      const employerJobIds = memoryStore.jobs
        .filter(j => j.employer === userId || j.employer === 'usr_employer_1')
        .map(j => j._id);

      const apps = memoryStore.applications
        .filter(a => employerJobIds.includes(a.job))
        .map(a => {
          const jobDetails = memoryStore.jobs.find(j => j._id === a.job);
          const applicantDetails = memoryStore.users.find(u => u._id === a.applicant) || {
            name: 'Alex Johnson',
            email: 'seeker@jobnest.com',
            phone: '+1 (555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          };

          return {
            ...a,
            job: jobDetails,
            applicant: applicantDetails
          };
        });

      return res.json(apps);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Applied', 'Shortlisted', 'Hired', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (req.dbConnected) {
      const app = await Application.findById(id);
      if (!app) return res.status(404).json({ message: 'Application not found' });

      app.status = status;
      await app.save();
      return res.json(app);
    } else {
      const app = memoryStore.applications.find(a => a._id === id);
      if (!app) return res.status(404).json({ message: 'Application not found' });

      app.status = status;
      return res.json(app);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
