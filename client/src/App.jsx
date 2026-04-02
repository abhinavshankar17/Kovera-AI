import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Placeholders for Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import OnboardingPage from './pages/OnboardingPage';

// Rider Dashboard Components
import SidebarLayout from './components/SidebarLayout';
import HomePage from './pages/HomePage';
import PoliciesPage from './pages/PoliciesPage';
import PayoutHistoryPage from './pages/PayoutHistoryPage';
import EarningsPage from './pages/EarningsPage';

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
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/clear" element={<>{localStorage.clear()}<Navigate to="/auth" /></>} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={
        <ProtectedRoute roleRequired="worker">
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      {/* Nested Routing for Worker Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute roleRequired="worker">
          <SidebarLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="payouts" element={<PayoutHistoryPage />} />
        <Route path="earnings" element={<EarningsPage />} />
      </Route>

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
