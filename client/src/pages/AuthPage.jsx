import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiShield, FiLock, FiMail, FiUser, FiMapPin, FiTruck } from 'react-icons/fi';

const AuthPage = () => {
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [isLogin, setIsLogin] = useState(queryParams.get('mode') !== 'signup');
  const [role, setRole] = useState(queryParams.get('role') === 'admin' ? 'admin' : 'worker');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', 
    city: 'Chennai', deliveryPlatform: 'Swiggy', primaryZone: 'T. Nagar'
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.activePolicies && user.activePolicies.length > 0) navigate('/dashboard');
      else navigate('/onboarding');
    }
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = isLogin 
      ? await login(formData.email, formData.password, role)
      : await register({
          ...formData, 
          role,
          preferredWorkingHours: { start: '09:00', end: '18:00', shift: 'Flexible' },
          avgWeeklyEarnings: 3000
        });
        
    if (!res.success) setErrorMsg(res.message);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="auth-bg" />
      
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px' }}>
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', position: 'relative', padding: '40px' }}>
          <div 
            className="scan-line" 
            style={{ 
              background: role === 'admin' ? 'var(--accent-indigo)' : 'var(--accent-mint)',
              boxShadow: `0 0 15px ${role === 'admin' ? 'var(--accent-indigo)' : 'var(--accent-mint)'}`
            }} 
          />
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="glow-on-hover" style={{ display: 'inline-flex', padding: '15px', background: 'rgba(0, 255, 204, 0.1)', borderRadius: '50%', marginBottom: '16px', border: '1px solid var(--accent-mint)' }}>
              <FiShield size={32} color="var(--accent-mint)" />
            </div>
            <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '8px' }}>Kovera AI</h1>
            <p className="text-subtle">
              {role === 'admin' ? 'Strategic Fleet Management' : 'AI-Powered Collective Resilience'}
            </p>
          </div>

          <div style={{ display: 'flex', marginBottom: '32px', background: 'var(--bg-input)', borderRadius: '12px', padding: '6px' }}>
             <button 
               className="glow-on-hover"
               style={{ flex: 1, padding: '12px', borderRadius: '8px', background: role === 'worker' ? 'var(--accent-gradient)' : 'transparent', color: role==='worker'?'white': 'var(--text-muted)', border:'none', cursor:'pointer', fontWeight: '600', transition: '0.3s' }}
               onClick={() => setRole('worker')}
               type="button"
             >Rider Access</button>
             <button 
               className="glow-on-hover"
               style={{ flex: 1, padding: '12px', borderRadius: '8px', background: role === 'admin' ? 'var(--premium-gradient)' : 'transparent', color: role==='admin'?'white': 'var(--text-muted)', border:'none', cursor:'pointer', fontWeight: '600', transition: '0.3s' }}
               onClick={() => setRole('admin')}
               type="button"
             >Admin Portal</button>
          </div>

          {errorMsg && <div className="badge badge-error" style={{ marginBottom: '20px', width: '100%', textAlign: 'center', padding: '10px' }}>{errorMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" name="name" className="form-input" style={{ paddingLeft: '42px' }} required placeholder="John Doe" onChange={handleChange} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" name="email" className="form-input" style={{ paddingLeft: '42px' }} required placeholder="name@company.com" onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Secure Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" name="password" className="form-input" style={{ paddingLeft: '42px' }} required placeholder="••••••••" onChange={handleChange} />
              </div>
            </div>

            {!isLogin && role === 'worker' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <div style={{ position: 'relative' }}>
                    <FiTruck style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                    <select name="deliveryPlatform" className="form-select" style={{ paddingLeft: '34px', fontSize: '0.85rem' }} onChange={handleChange}>
                      <option>Swiggy</option>
                      <option>Zomato</option>
                      <option>Zepto</option>
                      <option>Blinkit</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Zone</label>
                  <div style={{ position: 'relative' }}>
                    <FiMapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }} />
                    <select name="primaryZone" className="form-select" style={{ paddingLeft: '34px', fontSize: '0.85rem' }} onChange={handleChange}>
                      <option>T. Nagar</option>
                      <option>Velachery</option>
                      <option>Adyar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className={role === 'admin' ? "btn btn-premium" : "btn btn-primary"} style={{ width: '100%', marginTop: '10px' }}>
              {isLogin ? 'Sign In' : 'Create Secure ID'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? "New to Kovera? " : "Already protected? "}
            <span style={{ color: 'var(--accent-mint)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Join the Collective' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
