import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "mock_worker_1",
    name: "Alex Rider",
    email: "alex@gigshield.com",
    role: "worker",
    walletBalance: 120,
    primaryZone: "T. Nagar",
    preferredWorkingHours: { start: "10:00 AM", end: "8:00 PM", shift: "Flexible" },
    avgWeeklyEarnings: 2500,
    activePolicy: {
      name: "Heavy Rain Protection",
      weeklyPremium: 50,
      maxPayout: 1500
    },
    payoutHistory: [
      { id: 1, date: "2026-03-28", trigger: "Heavy Rain Level 3", amount: 450, status: "Credited" },
      { id: 2, date: "2026-03-15", trigger: "Heatwave Alert", amount: 200, status: "Credited" },
      { id: 3, date: "2026-02-10", trigger: "Waterlogging Delay", amount: 300, status: "Credited" }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hardcoded user, no loading needed.
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('gigshield_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      setUser(data);
      localStorage.setItem('gigshield_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gigshield_user');
  };

  const updateUserPolicy = (policyData) => {
     const updatedUser = { ...user, activePolicy: policyData.activePolicy };
     setUser(updatedUser);
     localStorage.setItem('gigshield_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserPolicy }}>
      {children}
    </AuthContext.Provider>
  );
};
