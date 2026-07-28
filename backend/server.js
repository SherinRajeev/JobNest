import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser & CORS
app.use(cors());
app.use(express.json());

// Initialize MongoDB connection check flag
let isDbConnected = false;

connectDB().then((connected) => {
  isDbConnected = connected;
});

// Middleware to inject db status into requests
app.use((req, res, next) => {
  req.dbConnected = isDbConnected;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'JobNest API - Gateway to Nearby Part-Time Jobs',
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'MongoDB Connected' : 'In-Memory Store Mode'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  JobNest Backend API Running on http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
