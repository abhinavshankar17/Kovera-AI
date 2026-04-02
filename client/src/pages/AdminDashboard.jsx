import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiCreditCard, FiAlertTriangle, FiLogOut, FiShield, FiActivity, FiMapPin, FiPlayCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [metricsRes, ridersRes] = await Promise.all([
          axios.get('/api/admin/metrics', config),
          axios.get('/api/admin/riders', config)
        ]);
        setMetrics(metricsRes.data);
        setRiders(ridersRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Admin fetch error", error);
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchAdminData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSimulateDisruption = () => {
    alert("Simulation: Live trigger for Heatwave in T. Nagar dispatched! Systems are now evaluating payouts.");
  };

  if (loading) return <div className="container" style={{paddingTop: '60px'}}>Loading Admin Dashboard...</div>;

  const totalRiders = metrics?.totalWorkers || 0;
  const totalPolicies = metrics?.totalPolicies || 0;
  const totalPayouts = metrics?.financialViability?.totalPayoutsIssued || 0;

  return (
    <div className="animate-fade-in" style={{ padding: '40px', background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <h1 className="text-gradient" style={{ margin: 0 }}>Fleet Management Hub</h1>
           <p className="text-subtle" style={{ margin: '8px 0 0 0' }}>GigShield AI Central Command</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-premium" onClick={handleSimulateDisruption} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <FiPlayCircle /> Simulate Weather Trigger
          </button>
          <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <FiLogOut /> Admin Logout
          </button>
        </div>
      </div>

      {/* Global Aggregation Stats */}
      <div className="grid-auto" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiUsers size={32} color="var(--accent-blue)" />
           </div>
           <div>
             <h4 className="text-subtle">Total Registered Riders</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{totalRiders.toLocaleString('en-IN')}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiShield size={32} color="var(--status-success)" />
           </div>
           <div>
             <h4 className="text-subtle">Active Parametric Coverages</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{totalPolicies.toLocaleString('en-IN')}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(122, 40, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiCreditCard size={32} color="var(--accent-purple)" />
           </div>
           <div>
             <h4 className="text-subtle">Total Payouts Triggered</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>₹{totalPayouts.toLocaleString('en-IN')}</p>
           </div>
        </div>
      </div>

      {/* Rider Fleet Tracking Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
             <FiActivity color="var(--accent-blue)" /> Individual Rider Analytics & Fraud Tracking
           </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Rider ID & Name</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Operating Zone</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Policy Standing</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Map Trace</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Fraud Score & Status</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' }}}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 'bold' }}>{rider.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rider._id}</div>
                  </td>
                  <td style={{ padding: '20px 24px', color: 'var(--text-main)' }}>{rider.primaryZone || 'Unassigned'}</td>
                  <td style={{ padding: '20px 24px' }}>
                    {rider.activePolicy ? (
                       <span className="badge badge-success">Active</span>
                    ) : (
                       <span className="badge" style={{background: 'rgba(255,255,255,0.1)'}}>No Policy</span>
                    )}
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <button 
                      onClick={() => setSelectedRider(rider)} 
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FiMapPin /> Trace Location
                    </button>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                          background: rider.fraudScore > 80 ? 'rgba(255, 23, 68, 0.1)' : rider.fraudScore > 40 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 230, 118, 0.1)',
                          color: rider.fraudScore > 80 ? 'var(--status-error)' : rider.fraudScore > 40 ? 'var(--status-warning)' : 'var(--status-success)',
                          border: `2px solid ${rider.fraudScore > 80 ? 'var(--status-error)' : rider.fraudScore > 40 ? 'var(--status-warning)' : 'var(--status-success)'}`
                       }}>
                         {rider.fraudScore || 12}
                       </div>
                       {rider.fraudStatus && rider.fraudStatus !== 'Low Risk' && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}><FiAlertTriangle /> Suspicious</span>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rider.fraudStatus}</span>
                          </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {riders.length === 0 && (
                <tr><td colSpan="5" style={{padding: '24px', textAlign: 'center', color: 'var(--text-muted)'}}>No riders registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Street Map Location Tracing Modal */}
      {selectedRider && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '800px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <div>
                  <h2 style={{ margin: 0, color: 'white' }}>Live Location Trace: {selectedRider.name}</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Operating Zone: {selectedRider.primaryZone || 'Unknown'}</p>
               </div>
               <button onClick={() => setSelectedRider(null)} className="btn btn-outline" style={{ padding: '8px 16px' }}>Close Tracking</button>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div className="badge badge-info">ID: {selectedRider._id}</div>
              <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiActivity /> Live Syncing Active</div>
            </div>
            
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              {/* Standard Street Map via OpenStreetMap based on typical Chennai coords for demonstration */}
              <iframe 
                width="100%" 
                height="450" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=80.18%2C12.98%2C80.26%2C13.06&amp;layer=mapnik&amp;marker=13.04%2C80.23" 
                style={{ border: 0 }}
                title="Rider Standard Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
