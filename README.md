# JobNest — Hyperlocal Part-Time Shift & Opportunity Platform 🪹

> **MERN Stack Application** | Node.js, Express.js, React.js (Vite), MongoDB Atlas & Corporate White / Royal Blue Design System  
> **Student / Team**: Sherin Rajeev (`T_N_X`)  
> **GitHub Repository**: [https://github.com/SherinRajeev/JobNest.git](https://github.com/SherinRajeev/JobNest.git)  

JobNest is a modern full-stack web application designed to connect part-time job seekers (college students, shift workers, tutors) with local business recruiters across Kerala (*Kottayam Town, Kochi/Ernakulam, Thiruvananthapuram, Thrissur, Kozhikode*). JobNest offers precise geodesic distance calculation ($0.1\text{ km} - 1.2\text{ km}$), interactive city location selectors, screen-centered shift modals, custom photo uploads, and dedicated portals for Applicants and Recruiters.

---

## 🌟 Key Features

### For Applicants (Job Seekers) 🎓
- **Hyperlocal Distance Engine**: Real-time Geodesic Haversine formula calculating distance in kilometers from Kottayam Town Center or chosen Kerala city hubs.
- **Interactive City Center Selector**: Easily switch reference location between *Kottayam Town*, *Kochi*, *Thiruvananthapuram*, *Thrissur*, and *Kozhikode*.
- **Spacious 1-Card Feed**: Browse active shift openings in a clean stacked feed.
- **Instant Search & Pay Filtering**: Filter by keywords, max distance radius ($5\text{ km} - 300\text{ km}$), min hourly pay rate ($\text{₹}/hr$), category (*Cafe & Barista, Retail, Delivery, Tutor, Event Staff, Admin*), and timing.
- **Screen-Centered Shift Modal**: View shift tasks, perks, and requirements in a crisp centered backdrop modal.
- **Protected Quick Apply**: Submit applications with mandatory phone number, availability, and cover note *(requires signed-in Applicant account)*.
- **My Applications Dashboard**: Track submitted application statuses (`Applied`, `Shortlisted`, `Hired`) with persistent client and database synchronization.
- **Custom Photo Avatar Upload**: Upload a profile photo directly from your computer device or generate a cartoon avatar.

### For Recruiters (Employers) 💼
- **Dedicated Recruiter Hiring Portal**: Direct routing to `/employer-dashboard` upon login.
- **Shift Opening Dispatcher**: Post new shift listings with position title, company name, hourly pay rate ($\text{₹}/hr$), shift schedule, location address, perks, and requirements.
- **Candidate Applications Management**: Inspect received applications with full applicant profile details, cover note, and availability.
- **One-Click Phone Dialer (`tel:`)**: Contact candidates directly via their phone number with a single click.
- **One-Click Hiring Actions**: Update candidate status to *Shortlisted* or *Hired*.
- **Strict Role Binding & Security**: Emails are permanently bound to their registered role (*Recruiter* vs *Applicant*) to prevent role conflicts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite Build Engine, React Router v6, Lucide React Icons.
- **Styling**: Vanilla CSS Design Tokens (`index.css`), Glassmorphic aesthetics, Google Fonts (*Outfit*, *Inter*), CSS Grid, Flexbox, and full Mobile/Tablet Media Queries (`<960px`, `<680px`).
- **Backend**: Node.js, Express.js RESTful API, JWT (JSON Web Token) Authentication, Password Hashing with Bcrypt.js.
- **Database**: MongoDB Atlas Cloud Cluster (`mongodb+srv://...`) with Mongoose ODM schemas (`User`, `Job`, `Application`) + zero-downtime client-side fallback storage (`localStorage`).

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/) (or built-in fallback store)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/SherinRajeev/JobNest.git
cd JobNest

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://sherinrajeev16_db_user:Sherin2026@cluster0.kbactr5.mongodb.net/jobnest?appName=Cluster0
JWT_SECRET=jobnest_secret_key_2026_super_secure
NODE_ENV=development
```

### 3. Database Seeding (16 Authentic Kerala Shifts)
To seed 16 authentic Kerala recruiter shift listings into MongoDB Atlas:

```bash
cd backend
npm run seed
```

### 4. Running Locally

```bash
# Terminal 1: Backend API Server
cd backend
npm run dev

# Terminal 2: Frontend Vite Client
cd frontend
npm run dev
```

Launch `http://localhost:3000` in your browser.

---

## ⚡ Demo Credentials

| Account Role | Email Address | Password | Destination Portal |
| :--- | :--- | :--- | :--- |
| **Applicant** | `seeker@jobnest.com` | `password123` | Browse & Apply (`/jobs`) |
| **Recruiter** | `employer@jobnest.com` | `password123` | Recruiter Hiring Portal (`/employer-dashboard`) |

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Applicant or Recruiter account | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | Public |
| `GET` | `/api/auth/me` | Fetch current authenticated user session | Authenticated |
| `GET` | `/api/jobs` | Fetch shifts with distance & category filters | Public |
| `POST` | `/api/jobs` | Post new part-time shift opening | Recruiter |
| `DELETE`| `/api/jobs/:id` | Remove active shift posting | Recruiter |
| `POST` | `/api/applications` | Apply for a shift opening | Applicant |
| `GET` | `/api/applications/my` | Fetch applicant's submitted applications | Applicant |
| `GET` | `/api/applications/employer`| Fetch candidate applications for recruiter | Recruiter |
| `PUT` | `/api/applications/:id/status`| Update applicant status (Shortlist/Hire) | Recruiter |
