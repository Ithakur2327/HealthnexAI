import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import History from './pages/History';
import NexAI from './pages/NexAI';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes - Available to all users */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/results" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="/nexai" element={<NexAI />} />
              <Route path="/profile" element={<Profile />} />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;