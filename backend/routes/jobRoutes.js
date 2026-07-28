import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob
} from '../controllers/jobController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, employerOnly, createJob);
router.put('/:id', protect, employerOnly, updateJob);
router.delete('/:id', protect, employerOnly, deleteJob);
router.post('/:id/save', protect, toggleSaveJob);

export default router;
