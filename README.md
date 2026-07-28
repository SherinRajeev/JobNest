# JobNest: Your Gateway to Nearby Part-Time Jobs 🪹

> **MERN Stack Application** | Express, Node.js, React (Vite), MongoDB & Modern Glassmorphism Design System

JobNest is a modern full-stack web platform designed to bridge local part-time job seekers (students, freelancers, flexible shift workers) with nearby businesses and employers. JobNest offers distance-radius filtering, interactive job radar maps, quick application submissions, and dedicated dashboards for candidates and employers.

---

## 🌟 Key Features

### For Job Seekers 🎓
- **Distance Radius Filter**: Find flexible part-time shifts within 1 km, 5 km, 10 km, or 25 km of your location.
- **Interactive Job Radar Map**: Visualize local job pins with hourly rates directly on a radar map view.
- **Instant Filters & Search**: Search by keywords, hourly pay rate, category (Barista, Retail, Delivery, Tutor, Event Staff, Office Admin), and shift timing (Morning, Evening, Weekend).
- **One-Click Quick Apply**: Submit applications with availability notes and contact details in seconds.
- **Job Seeker Dashboard**: Track application statuses (`Applied`, `Shortlisted`, `Hired`, `Rejected`) and manage bookmarked jobs.

### For Employers & Job Posters 💼
- **Part-Time Shift Dispatcher**: Create detailed job listings with hourly pay rate, shift times, perks, and position quotas.
- **Employer Hiring Portal**: Review applicant profiles, cover notes, and contact info in real-time.
- **One-Click Applicant Management**: Update candidate status to *Shortlisted*, *Hired*, or *Rejected*.
- **Hiring Metrics & Analytics**: Track total applicants, active listings, and candidate pipeline stats.

---

## 🛠️ Technology Architecture

- **Frontend**: React 18, Vite build system, React Router 6, Axios, Lucide React Icons.
- **Styling**: Vanilla CSS Design System with dark-mode glassmorphic aesthetics, Google Fonts (*Inter*, *Outfit*), CSS Grid, Flexbox, and CSS keyframe micro-animations.
- **Backend**: Node.js, Express.js RESTful API, JWT Authentication, Bcrypt password hashing.
- **Database**: MongoDB & Mongoose ODM (with built-in zero-config in-memory fallback for instant out-of-the-box demo testing).

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Optional — an in-memory fallback store runs automatically if MongoDB is absent)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/JobNest.git
cd JobNest

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file inside the `backend` directory (or use default fallback settings):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobnest
JWT_SECRET=jobnest_secret_key_2026_super_secure
NODE_ENV=development
```

### 3. (Optional) Database Seeding
To pre-populate realistic part-time listings and demo accounts:

```bash
cd backend
npm run seed
```

### 4. Running the Application

```bash
# Terminal 1: Run Backend API Server
cd backend
npm run dev

# Terminal 2: Run Frontend Vite Client
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000` to launch **JobNest**.

---

## ⚡ Demo Credentials

For instant presentation or testing, click the **Instant Demo Login** buttons on the Login page, or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Job Seeker** | `seeker@jobnest.com` | `password123` |
| **Employer** | `employer@jobnest.com` | `password123` |

---

## 🌐 API Endpoint Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Seeker or Employer account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/profile` | Fetch authenticated user profile | Yes |
| `GET` | `/api/jobs` | Search jobs with distance & category filters | No |
| `GET` | `/api/jobs/:id` | Fetch detailed job info by ID | No |
| `POST` | `/api/jobs` | Post new part-time shift | Yes (Employer) |
| `POST` | `/api/jobs/:id/save` | Bookmark / Save job for seeker | Yes |
| `POST` | `/api/applications` | Apply for a job opening | Yes (Seeker) |
| `GET` | `/api/applications/my` | Fetch seeker application history | Yes (Seeker) |
| `GET` | `/api/applications/employer`| Fetch candidate applications for employer | Yes (Employer) |
| `PUT` | `/api/applications/:id/status`| Update applicant status (Shortlist/Hire) | Yes (Employer) |
