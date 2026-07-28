import Job from '../models/Job.js';
import User from '../models/User.js';
import { memoryStore } from '../config/store.js';

export const getJobs = async (req, res) => {
  try {
    const { search, category, maxDistance, minRate, shiftTiming } = req.query;

    if (req.dbConnected) {
      let query = { status: 'active' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { locationName: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (shiftTiming && shiftTiming !== 'All') {
        query.shiftTiming = shiftTiming;
      }

      if (minRate) {
        query.hourlyRate = { $gte: Number(minRate) };
      }

      if (maxDistance) {
        query.distanceKm = { $lte: Number(maxDistance) };
      }

      const jobs = await Job.find(query).sort({ createdAt: -1 });
      return res.json(jobs);
    } else {
      // In-memory filter
      let filtered = [...memoryStore.jobs];

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          j =>
            j.title.toLowerCase().includes(s) ||
            j.company.toLowerCase().includes(s) ||
            j.description.toLowerCase().includes(s) ||
            j.locationName.toLowerCase().includes(s)
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter(j => j.category === category);
      }

      if (shiftTiming && shiftTiming !== 'All') {
        filtered = filtered.filter(j => j.shiftTiming === shiftTiming);
      }

      if (minRate) {
        filtered = filtered.filter(j => j.hourlyRate >= Number(minRate));
      }

      if (maxDistance) {
        filtered = filtered.filter(j => j.distanceKm <= Number(maxDistance));
      }

      return res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.dbConnected) {
      const job = await Job.findById(id).populate('employer', 'name email company avatar phone');
      if (job) return res.json(job);
    } else {
      const job = memoryStore.jobs.find(j => j._id === id);
      if (job) return res.json(job);
    }
    return res.status(404).json({ message: 'Job posting not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      category,
      hourlyRate,
      shiftTiming,
      hoursPerWeek,
      locationName,
      coordinates,
      distanceKm,
      description,
      requirements,
      perks,
      positionsAvailable
    } = req.body;

    if (!title || !company || !category || !hourlyRate || !locationName || !description) {
      return res.status(400).json({ message: 'Please fill in all required job fields' });
    }

    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const job = await Job.create({
        title,
        company,
        employer: userId,
        category,
        hourlyRate: Number(hourlyRate),
        shiftTiming: shiftTiming || 'Flexible',
        hoursPerWeek: Number(hoursPerWeek) || 15,
        locationName,
        coordinates: coordinates || { lat: 40.7128, lng: -74.0060 },
        distanceKm: Number(distanceKm) || 1.5,
        description,
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []),
        perks: Array.isArray(perks) ? perks : (perks ? perks.split(',').map(p => p.trim()) : []),
        positionsAvailable: Number(positionsAvailable) || 1
      });

      return res.status(201).json(job);
    } else {
      const newJob = {
        _id: `job_${Date.now()}`,
        title,
        company,
        employer: userId,
        category,
        hourlyRate: Number(hourlyRate),
        shiftTiming: shiftTiming || 'Flexible',
        hoursPerWeek: Number(hoursPerWeek) || 15,
        locationName,
        coordinates: coordinates || { lat: 40.7128 + (Math.random() - 0.5) * 0.05, lng: -74.0060 + (Math.random() - 0.5) * 0.05 },
        distanceKm: Number(distanceKm) || parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
        description,
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : []),
        perks: Array.isArray(perks) ? perks : (perks ? perks.split(',').map(p => p.trim()) : []),
        positionsAvailable: Number(positionsAvailable) || 1,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      memoryStore.jobs.unshift(newJob);
      return res.status(201).json(newJob);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      if (job.employer.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to update this job' });
      }

      Object.assign(job, req.body);
      const updated = await job.save();
      return res.json(updated);
    } else {
      const jobIndex = memoryStore.jobs.findIndex(j => j._id === id);
      if (jobIndex === -1) return res.status(404).json({ message: 'Job not found' });

      memoryStore.jobs[jobIndex] = { ...memoryStore.jobs[jobIndex], ...req.body };
      return res.json(memoryStore.jobs[jobIndex]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      if (job.employer.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this job' });
      }
      await job.deleteOne();
      return res.json({ message: 'Job removed successfully' });
    } else {
      const index = memoryStore.jobs.findIndex(j => j._id === id);
      if (index !== -1) {
        memoryStore.jobs.splice(index, 1);
        return res.json({ message: 'Job removed successfully' });
      }
      return res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    if (req.dbConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isSaved = user.savedJobs.includes(id);
      if (isSaved) {
        user.savedJobs = user.savedJobs.filter(j => j.toString() !== id);
      } else {
        user.savedJobs.push(id);
      }
      await user.save();
      return res.json({ savedJobs: user.savedJobs, message: isSaved ? 'Removed from saved jobs' : 'Saved job successfully' });
    } else {
      const user = memoryStore.users.find(u => u._id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      if (!user.savedJobs) user.savedJobs = [];
      const index = user.savedJobs.indexOf(id);
      let isSaved = index !== -1;
      if (isSaved) {
        user.savedJobs.splice(index, 1);
      } else {
        user.savedJobs.push(id);
      }
      return res.json({ savedJobs: user.savedJobs, message: isSaved ? 'Removed from saved jobs' : 'Saved job successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
