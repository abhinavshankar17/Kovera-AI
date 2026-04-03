import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShield, FiCloudLightning, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>
          Collective Resilience for the 
          <br/>
          <span className="text-gradient">Gig Economy</span>
        </h1>
        <p className="text-subtle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Kovera AI protects delivery partners through algorithmic risk assessment 
          and community-driven hazard reporting. Resilience, powered by the collective.
        </p>
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ marginRight: '16px', padding: '16px 32px', fontSize: '1.1rem' }}>Get Covered</button>
          <button className="btn btn-outline" onClick={() => navigate('/auth?role=admin')} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Partner Portal</button>
        </div>
      </div>

      {/* Features Grid */}
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }} className="text-premium">How It Works</h2>
      <div className="grid-auto">
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiCloudLightning size={48} color="var(--accent-blue)" style={{ marginBottom: '20px' }} />
          <h3>AI Trigger Engine</h3>
          <p className="text-subtle" style={{ marginTop: '10px' }}>Automatically verifies weather API and traffic data for your delivery zone during your shift.</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiTrendingUp size={48} color="var(--accent-purple)" style={{ marginBottom: '20px' }} />
          <h3>Smart Earnings Payout</h3>
          <p className="text-subtle" style={{ marginTop: '10px' }}>Payouts scale dynamically based on your average daily earnings and disrupted hours.</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiShield size={48} color="var(--status-success)" style={{ marginBottom: '20px' }} />
          <h3>Fraud & Claim Automation</h3>
          <p className="text-subtle" style={{ marginTop: '10px' }}>Forget filling forms. 90% of claims are auto-paid upon event confirmation using AI validation.</p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
