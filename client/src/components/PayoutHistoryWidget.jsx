import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle } from 'react-icons/fi';

const PayoutHistoryWidget = () => {
  const { user } = useContext(AuthContext);

  if (!user || (!user.payoutHistory || user.payoutHistory.length === 0)) {
    return null; // hide if none
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px' }}>
      <h3 className="text-subtle" style={{ marginBottom: '16px' }}>Recent Parametric Payouts</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {user.payoutHistory.map((payout) => (
          <div key={payout.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-input)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiCheckCircle size={24} color="var(--status-success)" />
              <div>
                <p style={{ fontWeight: 'bold' }}>{payout.trigger}</p>
                <p className="text-subtle">{payout.date} • AI Auto-Triggered</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--status-success)' }}>+₹{payout.amount}</p>
              <p className="text-subtle">{payout.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutHistoryWidget;
