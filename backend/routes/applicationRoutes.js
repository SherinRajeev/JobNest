import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/my', protect, getMyApplications);
router.get('/employer', protect, employerOnly, getEmployerApplications);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

export default router;
