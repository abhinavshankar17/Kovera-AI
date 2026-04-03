import React, { useState } from 'react';
import { FiAlertOctagon, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const HazardReporter = ({ zone, userToken }) => {
  const [hazardType, setHazardType] = useState('Waterlogging');
  const [severity, setSeverity] = useState('Moderate');
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consensusMsg, setConsensusMsg] = useState('');

  const hazards = [
    { id: 'Waterlogging', label: 'Flood/Water' },
    { id: 'Extreme Heat', label: 'Extreme Heat' },
    { id: 'Traffic Gridlock', label: 'Traffic Jam' },
    { id: 'Road Closure', label: 'Road Closed' },
    { id: 'Accident', label: 'Accident' }
  ];

  const handleReport = async () => {
    setLoading(true);
    try {
      // Mock location for demo (centered in zone)
      const location = { lat: 13.0405, lng: 80.2337 }; 
      
      const config = { headers: { Authorization: `Bearer ${userToken}` } };
      const response = await axios.post('/api/community/report', {
        zone,
        hazardType,
        severity,
        location
      }, config);

      if (response.data.success) {
        setReported(true);
        if (response.data.triggered) {
          setConsensusMsg(response.data.message);
        }
      }
    } catch (err) {
      console.error("Report failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (reported) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', borderColor: 'var(--status-success)' }}>
        <FiCheckCircle size={40} color="var(--status-success)" style={{ marginBottom: '12px' }} />
        <h4 style={{ color: 'var(--status-success)' }}>Report Submitted</h4>
        <p className="text-subtle" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
          {consensusMsg || "Waiting for collective verification. Your report helps protect the community."}
        </p>
        <button className="btn btn-outline" style={{ marginTop: '16px', fontSize: '0.8rem' }} onClick={() => setReported(false)}>Report Another</button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ background: 'rgba(255, 23, 68, 0.05)', border: '1px solid rgba(255, 23, 68, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <FiAlertOctagon color="var(--status-error)" size={24} />
        <h3 style={{ margin: 0 }}>Report Local Hazard</h3>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.8rem' }}>Disruption Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {hazards.map((h) => (
            <button
              key={h.id}
              onClick={() => setHazardType(h.id)}
              style={{
                padding: '10px 6px', borderRadius: '8px', border: '1px solid var(--border-light)',
                background: hazardType === h.id ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                color: hazardType === h.id ? 'white' : 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
         <label className="form-label" style={{ fontSize: '0.8rem' }}>Severity</label>
         <div style={{ display: 'flex', gap: '10px' }}>
            {['Moderate', 'Severe', 'Critical'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                <input type="radio" name="severity" checked={severity === s} onChange={() => setSeverity(s)} />
                {s}
              </label>
            ))}
         </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <FiMapPin /> {zone} (Verified Presence)
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--status-error)' }}
        disabled={loading}
        onClick={handleReport}
      >
        <FiSend /> {loading ? 'Transmitting...' : 'Alert the Collective'}
      </button>
    </div>
  );
};

export default HazardReporter;
