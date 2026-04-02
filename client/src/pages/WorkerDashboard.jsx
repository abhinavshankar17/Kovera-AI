import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import CommunityFeed from '../components/CommunityFeed';
import { FiTrendingUp, FiShield, FiAlertTriangle, FiLogOut, FiMapPin, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import WeatherAlertBanner from '../components/WeatherAlertBanner';
import { getBrowserLocation, getCityFromCoords } from '../services/locationService';


import PayoutHistoryWidget from '../components/PayoutHistoryWidget';
import PolicyStoreWidget from '../components/PolicyStoreWidget';

const WorkerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [protectionScore, setProtectionScore] = useState(82); // Simulated AI score based on policy max / avg income
  const [liveLocation, setLiveLocation] = useState('Fetching...');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coords = await getBrowserLocation();
        const city = await getCityFromCoords(coords.lat, coords.lng);
        setLiveLocation(city || 'Unknown Zone');
      } catch (error) {
        setLiveLocation(user?.primaryZone || 'Location access denied');
      }
    };
    if (user) {
      fetchLocation();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.activePolicy && user.avgWeeklyEarnings) {
      let score = (user.activePolicy.maxPayout / (user.avgWeeklyEarnings * 0.5)) * 100;
      score = Math.min(Math.round(score), 100);
      setProtectionScore(Math.max(score, 50));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || !user.activePolicy) return <div>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 className="text-gradient">Hello, {user.name}</h1>
        <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <FiLogOut /> Logout
        </button>
      </div>

      <div className="grid-auto" style={{ marginBottom: '24px' }}>
        
        {/* Profile & Live Status Card */}
        <div className="glass-panel">
          <h3 className="text-subtle" style={{ marginBottom: '16px' }}>Status & Hours</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)' }}>
                <FiMapPin size={24} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p className="text-subtle">Live Operating Zone</p>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1.2' }}>{liveLocation}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(122, 40, 255, 0.1)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
                <FiClock size={24} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p className="text-subtle">Working Hours ({user.preferredWorkingHours?.shift || 'Flexible'})</p>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: '1.2' }}>
                  {user.preferredWorkingHours?.start} - {user.preferredWorkingHours?.end}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Policy Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-gradient)', filter: 'blur(50px)', opacity: 0.3, borderRadius: '50%' }}></div>
          <h3 className="text-subtle" style={{ marginBottom: '8px' }}>Active Policy</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <FiShield size={32} color="var(--accent-blue)" />
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{user.activePolicy.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div>
              <p className="text-subtle">Weekly Premium</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{user.activePolicy.weeklyPremium}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-subtle">Max Payout</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--status-success)' }}>₹{user.activePolicy.maxPayout}</p>
            </div>
          </div>
        </div>

        {/* Protection Score Dial (Simulated visual logic) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '16px' }}>Income Protection Score</h3>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-panel-solid)', 
            border: `6px solid ${protectionScore > 75 ? 'var(--status-success)' : 'var(--status-warning)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
            boxShadow: `0 0 20px ${protectionScore > 75 ? 'rgba(0,230,118,0.2)' : 'rgba(255,234,0,0.2)'}`
          }}>
             <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{protectionScore}</span>
             <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <p className="text-premium" style={{ fontWeight: 'bold' }}>{protectionScore > 75 ? 'Strong Protection' : 'Moderate Protection'}</p>
        </div>

        {/* Community Feed Widget */}
        <CommunityFeed zone={user.primaryZone} />
        
      </div>

      {/* Dynamic Weather Alerts based on Live Location Data */}
      <WeatherAlertBanner defaultZone={user.primaryZone} />

      <PolicyStoreWidget />
      <PayoutHistoryWidget />

    </div>
  );
};

export default WorkerDashboard;
