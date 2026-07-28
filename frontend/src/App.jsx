import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { PostJob } from './pages/PostJob';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route
                  path="/seeker-dashboard"
                  element={
                    <ProtectedRoute requiredRole="seeker">
                      <SeekerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer-dashboard"
                  element={
                    <ProtectedRoute requiredRole="employer">
                      <EmployerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post-job"
                  element={
                    <ProtectedRoute requiredRole="employer">
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
