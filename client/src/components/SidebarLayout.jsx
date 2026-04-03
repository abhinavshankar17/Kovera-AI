import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiClock, FiCreditCard, FiLogOut, FiShield } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const SidebarLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = ({ isActive }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: '12px',
      background: isActive ? 'rgba(0, 255, 204, 0.1)' : 'transparent',
      color: isActive ? 'var(--accent-mint)' : 'var(--text-muted)',
      borderLeft: isActive ? '4px solid var(--accent-mint)' : '4px solid transparent',
      transition: 'all 0.3s ease',
      fontWeight: isActive ? 'bold' : 'normal',
      boxShadow: isActive ? 'inset 10px 0 20px rgba(0, 255, 204, 0.05)' : 'none',
      marginBottom: '8px',
      textDecoration: 'none'
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Vertical Sidebar */}
      <div className="glass-panel" style={{ 
        width: '280px', 
        position: 'fixed', 
        top: 0, bottom: 0, left: 0, 
        zIndex: 100, 
        borderRadius: 0, 
        borderRight: '1px solid var(--border-light)',
        borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px'
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '10px', borderRadius: '12px' }}>
               <FiShield size={24} color="white" />
            </div>
            <h2 className="text-gradient" style={{ margin: 0 }}>Kovera AI</h2>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <NavLink to="/dashboard/home" style={linkStyle}>
            <FiHome size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/dashboard/policies" style={linkStyle}>
            <FiFileText size={20} />
            <span>Active Policies</span>
          </NavLink>
          
          <NavLink to="/dashboard/payouts" style={linkStyle}>
            <FiClock size={20} />
            <span>Payout History</span>
          </NavLink>

          <NavLink to="/dashboard/earnings" style={linkStyle}>
            <FiCreditCard size={20} />
            <span>Earnings & Pay Till Date</span>
          </NavLink>
        </nav>

        {/* User Profile Snippet in Sidebar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: 'auto' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                 {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0, lineHeight: 1.2 }}>{user?.name}</p>
                <p className="text-subtle" style={{ margin: 0, fontSize: '0.8rem' }}>Verified Rider</p>
              </div>
           </div>

           <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
             <FiLogOut /> Logout
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '40px', maxWidth: '1200px' }}>
         <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
