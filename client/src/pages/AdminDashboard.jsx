import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FiUsers, FiCreditCard, FiAlertTriangle, FiLogOut, FiShield, 
  FiActivity, FiMapPin, FiPlayCircle, FiTrendingUp, FiCheckCircle, 
  FiXCircle, FiSettings, FiBarChart2, FiCpu 
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component to handle map resizing when tab shifts
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 14);
  }, [coords, map]);
  return null;
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [riders, setRiders] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [zones, setZones] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [selectedRider, setSelectedRider] = useState(null);
  const [auditRider, setAuditRider] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchData = async () => {
    try {
      const [mRes, rRes, pRes, zRes, hRes] = await Promise.all([
        axios.get('/api/admin/metrics', config),
        axios.get('/api/admin/riders', config),
        axios.get('/api/admin/payouts', config),
        axios.get('/api/admin/zones', config),
        axios.get('/api/admin/system-health', config)
      ]);
      setMetrics(mRes.data);
      setRiders(rRes.data);
      setPayouts(pRes.data);
      setZones(zRes.data);
      setSystemHealth(hRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Admin data fetch error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdatePayout = async (id, status) => {
    try {
      await axios.put(`/api/admin/payouts/${id}/status`, { status }, config);
      fetchData();
    } catch (err) { alert("Failed to update payout"); }
  };

  const handleUpdateMultiplier = async (id, multiplier) => {
    try {
      await axios.put(`/api/admin/zones/${id}/multiplier`, { multiplier }, config);
      fetchData();
    } catch (err) { alert("Failed to update multiplier"); }
  };

  const handleSuspendRider = async (id, isSuspended) => {
    try {
      await axios.put(`/api/admin/riders/${id}/suspend`, { isSuspended }, config);
      setAuditRider(null);
      fetchData();
    } catch (err) { alert("Failed to update suspension status"); }
  };

  if (loading) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Loading Command Center...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--border-light)', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', padding: '0 10px' }}>
           <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Kovera AI</h2>
           <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Resilience Command Center</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', icon: <FiBarChart2 />, label: 'Dashboard Overview' },
            { id: 'fleet', icon: <FiUsers />, label: 'Rider Fleet' },
            { id: 'claims', icon: <FiCreditCard />, label: 'Claims Queue' },
            { id: 'pricing', icon: <FiTrendingUp />, label: 'Pricing Engine' },
            { id: 'heatmap', icon: <FiMapPin />, label: 'Market Heatmap' },
            { id: 'health', icon: <FiCpu />, label: 'System Health' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                transition: '0.3s', fontWeight: activeTab === tab.id ? '600' : 'normal'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <button className="btn btn-outline" onClick={handleLogout} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
           <FiLogOut /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
            <div className="grid-auto" style={{ marginBottom: '40px' }}>
              <StatCard icon={<FiUsers color="var(--accent-blue)"/>} label="Total Riders" value={metrics?.totalWorkers || 0} />
              <StatCard icon={<FiShield color="var(--status-success)"/>} label="Active Policies" value={metrics?.totalPolicies || 0} />
              <StatCard icon={<FiCreditCard color="var(--accent-purple)"/>} label="Total Payouts" value={`₹${metrics?.financialViability?.totalPayoutsIssued || 0}`} />
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
               <h3 style={{ marginBottom: '24px' }}>Financial Health & Loss Ratio Trend</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                  <div>
                    <p className="text-subtle">Live Loss Ratio</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: metrics?.financialViability?.lossRatio > 80 ? 'var(--status-error)' : 'var(--status-success)' }}>
                      {metrics?.financialViability?.lossRatio}%
                    </p>
                  </div>
                  <div>
                    <p className="text-subtle">Sustainability Status</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{metrics?.financialViability?.profitabilityStatus}</p>
                  </div>
                  <div>
                    <p className="text-subtle">Reserve Balance</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{metrics?.financialViability?.reserveBalance?.toLocaleString()}</p>
                  </div>
               </div>

               {/* Add AreaChart Graph */}
               <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer>
                    <AreaChart data={metrics?.lossRatioHistory}>
                      <defs>
                        <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                      <Tooltip 
                        contentStyle={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                        itemStyle={{ color: 'white' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ratio" 
                        stroke="var(--accent-blue)" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorRatio)" 
                        name="Loss Ratio"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* Tab Content: FLEET */}
        {activeTab === 'fleet' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Rider Fleet</h1>
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Rider</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Zone</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Fraud Score</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 'bold' }}>{r.name} {r.isSuspended && <span className="badge badge-error" style={{fontSize:'0.6rem'}}>SUSPENDED</span>}</div>
                        <div className="text-subtle" style={{ fontSize: '0.8rem' }}>{r.email}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>{r.primaryZone}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.fraudScore > 70 ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: r.fraudScore > 70 ? 'var(--status-error)' : 'var(--status-success)', border: '1px solid', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {r.fraudScore}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button onClick={() => setSelectedRider(r)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FiMapPin /> Trace</button>
                          <button onClick={() => setAuditRider(r)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FiAlertTriangle /> Audit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: CLAIMS QUEUE */}
        {activeTab === 'claims' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Claims & Overrides</h1>
            <div className="glass-panel" style={{ padding: 0 }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Rider</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Trigger</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map(p => (
                      <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '16px 24px' }}>{p.user?.name}</td>
                        <td style={{ padding: '16px 24px' }}>
                           <div style={{ fontWeight: 'bold' }}>{p.triggerEvent?.type}</div>
                           <div className="text-subtle" style={{ fontSize: '0.8rem' }}>{p.triggerEvent?.zone}</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>₹{p.finalPayoutAmount}</td>
                        <td style={{ padding: '16px 24px' }}>
                           <span className={`badge badge-${p.status === 'Approved' || p.status === 'Auto-Paid' ? 'success' : (p.status === 'Rejected' ? 'error' : 'info')}`}>
                              {p.status}
                           </span>
                           {p.triggerEvent?.type?.startsWith('Community') && (
                             <div style={{ fontSize: '0.65rem', color: 'var(--accent-mint)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <FiUsers size={10} /> C-Proof Verified
                             </div>
                           )}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          {p.status === 'Pending' || p.status === 'Under Review' ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                               <button onClick={() => handleUpdatePayout(p._id, 'Approved')} style={{ background: 'var(--status-success)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><FiCheckCircle /></button>
                               <button onClick={() => handleUpdatePayout(p._id, 'Rejected')} style={{ background: 'var(--status-error)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><FiXCircle /></button>
                            </div>
                          ) : <FiCheckCircle color="gray" />}
                        </td>
                      </tr>
                    ))}
                    {payouts.length === 0 && <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', color:'var(--text-muted)'}}>No claims recorded.</td></tr>}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Tab Content: PRICING ENGINE */}
        {activeTab === 'pricing' && (
          <div className="animate-fade-in">
             <h1 style={{ marginBottom: '30px' }}>Dynamic Pricing Engine</h1>
             <p className="text-subtle" style={{ marginBottom: '20px' }}>Adjust city-wide risk multipliers to scale premiums in real-time based on live environmental threats.</p>
             <div className="grid-auto">
               {zones.map(z => (
                 <div key={z._id} className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>{z.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="text-subtle">Current Multiplier</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{z.pricingMultiplier}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3.0" step="0.1" 
                      value={z.pricingMultiplier} 
                      onChange={(e) => handleUpdateMultiplier(z._id, parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-blue)' }} 
                    />
                    <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                       Risk Indicators: Rain ({z.rainRisk}%) | Traffic ({z.trafficRisk}%)
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Tab Content: HEATMAP */}
        {activeTab === 'heatmap' && (
           <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Market Fleet Heatmap</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <div className="badge badge-success">Online: {riders.length}</div>
                   <div className="badge badge-info">Chennai Master View</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1, minHeight: 0 }}>
                <div className="glass-panel" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
                    <MapContainer 
                      center={[13.0405, 80.2337]} 
                      zoom={12} 
                      style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {riders.map(r => (
                        <CircleMarker 
                          key={r._id}
                          center={[r.lastKnownLocation?.lat || 13.04, r.lastKnownLocation?.lng || 80.23]}
                          radius={12}
                          pathOptions={{ 
                            fillColor: r.fraudScore > 70 ? '#ff1744' : '#00e676', 
                            fillOpacity: 0.4, 
                            color: 'transparent' 
                          }}
                        >
                          <Popup>
                            <div style={{ color: 'black' }}>
                              <strong>{r.name}</strong><br/>
                              Platform: {r.deliveryPlatform}<br/>
                              Fraud Score: {r.fraudScore}
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                      {/* Inner solid blip layer */}
                      {riders.map(r => (
                        <CircleMarker 
                          key={`inner-${r._id}`}
                          center={[r.lastKnownLocation?.lat || 13.04, r.lastKnownLocation?.lng || 80.23]}
                          radius={4}
                          pathOptions={{ 
                            fillColor: '#00d2ff', 
                            fillOpacity: 0.9, 
                            color: 'white', 
                            weight: 1 
                          }}
                        />
                      ))}
                    </MapContainer>
                   <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.85)', padding: '15px', borderRadius: '12px', border: '1px solid var(--accent-blue)', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>LIVE FLEET RADAR</p>
                      <div style={{ display: 'grid', gap: '8px' }}>
                         {['T. Nagar', 'Velachery', 'Adyar'].map(z => {
                            const count = riders.filter(r => r.primaryZone === z).length;
                            return (
                               <div key={z} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', width: '150px' }}>
                                  <span className="text-subtle">{z}</span>
                                  <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{count} Pings</span>
                               </div>
                            )
                         })}
                      </div>
                   </div>
                </div>
                
                <div className="glass-panel" style={{ overflowY: 'auto', padding: '20px' }}>
                   <h4 style={{ marginBottom: '15px' }}>High Risk Pings</h4>
                   <div style={{ display: 'grid', gap: '12px' }}>
                      {riders.filter(r => r.fraudScore > 80).slice(0, 8).map(r => (
                        <div key={r._id} style={{ padding: '12px', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)', borderRadius: '8px' }}>
                           <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{r.name}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--status-error)' }}>Fraud Risk: {r.fraudScore} | {r.primaryZone}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* Tab Content: HEALTH */}
        {activeTab === 'health' && (
          <div className="animate-fade-in">
             <h1 style={{ marginBottom: '30px' }}>System Infrastructure Health</h1>
             <div className="grid-auto">
                <HealthCard label="Google Maps API" data={systemHealth?.googleMaps} />
                <HealthCard label="OpenWeather Platform" data={systemHealth?.openWeather} />
                <HealthCard label="Stripe Infrastructure" data={systemHealth?.stripe} />
                <HealthCard label="Primary Database" data={systemHealth?.database} />
             </div>
             <div className="glass-panel" style={{ marginTop: '40px', padding: '20px', textAlign: 'center' }}>
                <p className="text-subtle">System Uptime: <span style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>{systemHealth?.uptime}</span></p>
             </div>
          </div>
        )}

      </div>

      {/* MODAL: Trace Location */}
      {selectedRider && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel" style={{ width: '85%', height: '85%', padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
               <div>
                  <h2 style={{ margin: 0, color: 'white' }}>Live Precision Trace: {selectedRider.name}</h2>
                  <p className="text-subtle" style={{ margin: 0 }}>Satellite Sync Active | {selectedRider.lastKnownLocation?.lat?.toFixed(5)}, {selectedRider.lastKnownLocation?.lng?.toFixed(5)}</p>
               </div>
               <button onClick={() => setSelectedRider(null)} className="btn btn-outline" style={{ padding: '8px 24px' }}>Stop Tracking</button>
            </div>
            <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--accent-blue)', boxShadow: '0 0 30px rgba(0,210,255,0.2)' }}>
              <MapContainer 
                center={[selectedRider.lastKnownLocation.lat, selectedRider.lastKnownLocation.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(90%)' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap coords={[selectedRider.lastKnownLocation.lat, selectedRider.lastKnownLocation.lng]} />
                <CircleMarker 
                  center={[selectedRider.lastKnownLocation.lat, selectedRider.lastKnownLocation.lng]}
                  radius={20}
                  pathOptions={{ color: 'var(--accent-blue)', fillColor: 'var(--accent-blue)', fillOpacity: 0.2, weight: 2, dashArray: '5, 5' }}
                />
                <CircleMarker 
                  center={[selectedRider.lastKnownLocation.lat, selectedRider.lastKnownLocation.lng]}
                  radius={6}
                  pathOptions={{ color: 'white', fillColor: 'var(--accent-blue)', fillOpacity: 1, weight: 2 }}
                />
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Deep Fraud Audit */}
      {auditRider && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '500px', padding: '30px' }}>
            <h2 style={{ marginBottom: '10px' }}>Fraud Investigation</h2>
            <p className="text-subtle" style={{ marginBottom: '24px' }}>In-depth AI analysis for {auditRider.name}</p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>AI Risk Assessment:</span>
                  <span style={{ color: auditRider.fraudScore > 70 ? 'var(--status-error)' : 'var(--status-success)', fontWeight: 'bold' }}>{auditRider.fraudStatus}</span>
               </div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Anomaly Log:</strong><br/>
                  - Occasional GPS jumping detected (~400m variance)<br/>
                  - Device ID matches multiple registered accounts (Flagged)<br/>
                  - Payout velocity higher than average for {auditRider.primaryZone}
               </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
               <button 
                  className={auditRider.isSuspended ? "btn btn-outline" : "btn btn-error"} 
                  style={{ flex: 1 }}
                  onClick={() => handleSuspendRider(auditRider._id, !auditRider.isSuspended)}
               >
                  {auditRider.isSuspended ? "Reactivate Account" : "Suspend Account"}
               </button>
               <button onClick={() => setAuditRider(null)} className="btn btn-outline" style={{ flex: 1 }}>Close Audit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <p className="text-subtle" style={{ margin: 0, fontSize: '0.85rem' }}>{label}</p>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  </div>
);

const HealthCard = ({ label, data }) => (
  <div className="glass-panel" style={{ padding: '20px' }}>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>{label}</h4>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 10px var(--status-success)' }}></div>
     </div>
     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span className="text-subtle">Status</span>
        <span style={{ color: 'var(--status-success)' }}>{data?.status}</span>
     </div>
     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '6px' }}>
        <span className="text-subtle">Latency</span>
        <span>{data?.latency}</span>
     </div>
  </div>
);

export default AdminDashboard;
