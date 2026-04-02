import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import CommunityFeed from '../components/CommunityFeed';
import { FiShield, FiMapPin, FiClock } from 'react-icons/fi';
import WeatherAlertBanner from '../components/WeatherAlertBanner';
import { getBrowserLocation, getCityFromCoords } from '../services/locationService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [protectionScore, setProtectionScore] = useState(82);
  const [liveLocation, setLiveLocation] = useState('Fetching...');
  const [isOnline, setIsOnline] = useState(false);

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
    if (user && user.activePolicies && user.avgWeeklyEarnings) {
      const totalMaxPayout = user.activePolicies.reduce((sum, p) => sum + p.maxPayout, 0);
      if (totalMaxPayout === 0) {
        setProtectionScore(0);
        return;
      }
      let score = (totalMaxPayout / (user.avgWeeklyEarnings * 0.5)) * 100;
      score = Math.min(Math.round(score), 100);
      setProtectionScore(Math.max(score, 10)); // Min 10 if they have policies
    } else {
      setProtectionScore(0); // 0 if no policies
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const totalWeeklyPremium = user.activePolicies ? user.activePolicies.reduce((sum, p) => sum + p.weeklyPremium, 0) : 0;
  const totalMaxPayoutAgg = user.activePolicies ? user.activePolicies.reduce((sum, p) => sum + p.maxPayout, 0) : 0;
  const activePolicyCount = user.activePolicies ? user.activePolicies.length : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '10px', fontSize: '0.9rem', minWidth: '150px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--accent-blue)' }}>{label}</p>
          <p style={{ margin: 0, color: 'var(--text-main)' }}>Earnings: <span style={{ fontWeight: 'bold' }}>₹{payload[0].value}</span></p>
          <p style={{ margin: '4px 0 0 0', color: 'var(--status-success)' }}>Protected: <span style={{ fontWeight: 'bold' }}>+₹{payload[1].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="text-gradient">Home Overview</h1>
        <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
           <span className="live-indicator"></span> Platform Live
        </div>
      </div>

      <div className="grid-auto" style={{ marginBottom: '24px' }}>
        
        {/* Gig Worker Actions Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Shift Status</h3>
              <p className="text-subtle" style={{ fontSize: '0.9rem' }}>{liveLocation}</p>
            </div>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              style={{ 
                background: isOnline ? 'var(--status-success)' : 'rgba(255, 255, 255, 0.1)',
                color: isOnline ? '#000' : 'white',
                border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.3s ease', boxShadow: isOnline ? '0 0 15px rgba(0,230,118,0.4)' : 'none'
              }}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          {/* Earnings Target Progress */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-subtle">Weekly Target</span>
              <span style={{ fontWeight: 'bold' }}>₹1,200 / ₹{user.avgWeeklyEarnings || '3,000'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: 'var(--accent-gradient)' }}></div>
            </div>
          </div>

          {/* Shift Schedule */}
          <div>
            <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--text-muted)' }}>Today's Shifts</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(122, 40, 255, 0.1)', border: '1px solid rgba(122, 40, 255, 0.3)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiClock color="var(--accent-purple)" size={20} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{user.preferredWorkingHours?.start || '10:00 AM'} - {user.preferredWorkingHours?.end || '8:00 PM'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.primaryZone || 'Assigned Zone'}</div>
                </div>
              </div>
              <div className="badge badge-success" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Booked</div>
            </div>
          </div>

        </div>

        {/* Total Coverage Summary */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-gradient)', filter: 'blur(50px)', opacity: 0.3, borderRadius: '50%' }}></div>
          <h3 className="text-subtle" style={{ marginBottom: '8px' }}>Total Coverage Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <FiShield size={32} color="var(--accent-blue)" />
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{activePolicyCount} Active Policies</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div>
              <p className="text-subtle">Aggregated Weekly Premium</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{totalWeeklyPremium}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-subtle">Aggregated Max Payout</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--status-success)' }}>₹{totalMaxPayoutAgg}</p>
            </div>
          </div>
        </div>

        {/* Protection Score Dial */}
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

      {/* Performance Graph */}
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
         <h3 className="text-subtle" style={{ marginBottom: '24px' }}>Performance & Protection Growth</h3>
         <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <AreaChart data={user.performanceData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-success)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--status-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="earnings" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                <Area type="monotone" dataKey="protected" stroke="var(--status-success)" strokeWidth={3} fillOpacity={1} fill="url(#colorProtected)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <WeatherAlertBanner defaultZone={user.primaryZone} />

    </div>
  );
};

export default HomePage;
