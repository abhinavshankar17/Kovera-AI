import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiShield, FiSun, FiCloudRain, FiAlertOctagon, FiWind, FiAlertTriangle, FiDroplet } from 'react-icons/fi';

const availablePolicies = [
  {
    id: "pol_1",
    name: "Heavy Rain Protection",
    description: "Auto-payout if rainfall exceeds 20mm/hr in your active zone.",
    weeklyPremium: 50,
    maxPayout: 1500,
    icon: FiCloudRain,
    color: "var(--accent-blue)"
  },
  {
    id: "pol_2",
    name: "Heatwave Shield",
    description: "Auto-payout if temperature exceeds 40°C during peak hours.",
    weeklyPremium: 40,
    maxPayout: 1200,
    icon: FiSun,
    color: "var(--status-warning)"
  },
  {
    id: "pol_3",
    name: "Traffic Gridlock Cover",
    description: "Compensation for severe unpredicted traffic delays (AI verified).",
    weeklyPremium: 70,
    maxPayout: 2000,
    icon: FiAlertOctagon,
    color: "var(--status-error)"
  },
  {
    id: "pol_4",
    name: "Cyclone & High Wind Cover",
    description: "Protection against severe cyclones and wind speeds > 60km/h (Coastal zones).",
    weeklyPremium: 60,
    maxPayout: 1800,
    icon: FiWind,
    color: "var(--accent-purple)"
  },
  {
    id: "pol_5",
    name: "Landslide Protection",
    description: "Immediate payout for work disrupted by verified landslides in hilly regions.",
    weeklyPremium: 80,
    maxPayout: 2500,
    icon: FiAlertTriangle,
    color: "#ff9100"
  },
  {
    id: "pol_6",
    name: "Urban Flood Shield",
    description: "Triggered instantly when waterlogging reaches critical levels during monsoons.",
    weeklyPremium: 90,
    maxPayout: 3000,
    icon: FiDroplet,
    color: "#00b0ff"
  }
];

const PolicyStoreWidget = () => {
  const { user, updateUserPolicy } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSubscribe = (policy) => {
    updateUserPolicy({ activePolicy: policy });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-premium" onClick={() => setIsOpen(true)}>
          Explore Coverage Store
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', border: '1px solid var(--accent-purple)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <h3 className="text-premium">Explore Policies</h3>
         <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setIsOpen(false)}>Close</button>
      </div>

      <div className="grid-auto">
        {availablePolicies.map((policy) => {
          const Icon = policy.icon;
          const isActive = user.activePolicy && user.activePolicy.name === policy.name;

          return (
            <div key={policy.id} style={{ 
              background: 'var(--bg-input)', 
              borderRadius: '12px', 
              padding: '20px',
              border: isActive ? `2px solid ${policy.color}` : '2px solid transparent',
              transition: 'all 0.3s ease'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ padding: '10px', background: 'var(--bg-panel-solid)', borderRadius: '8px' }}>
                   <Icon size={24} color={policy.color} />
                 </div>
                 <h4 style={{ margin: 0 }}>{policy.name}</h4>
               </div>
               <p className="text-subtle" style={{ minHeight: '40px', marginBottom: '16px' }}>{policy.description}</p>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                 <div>
                   <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Premium</p>
                   <p style={{ fontWeight: 'bold' }}>₹{policy.weeklyPremium}/wk</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Max Payout</p>
                   <p style={{ fontWeight: 'bold', color: 'var(--status-success)' }}>₹{policy.maxPayout}</p>
                 </div>
               </div>

               {isActive ? (
                 <button className="btn" style={{ width: '100%', background: 'transparent', border: `1px solid ${policy.color}`, color: policy.color, cursor: 'default' }}>Active</button>
               ) : (
                 <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleSubscribe(policy)}>Subscribe</button>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyStoreWidget;
