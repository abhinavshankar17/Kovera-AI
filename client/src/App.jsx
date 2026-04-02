import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Placeholders for Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingPage from './pages/OnboardingPage';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div style={{ color: 'white', padding: '50px' }}>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/auth" element={<Navigate to="/dashboard" />} />
      <Route path="/onboarding" element={
        <ProtectedRoute roleRequired="worker">
          <OnboardingPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute roleRequired="worker">
          <WorkerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roleRequired="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
