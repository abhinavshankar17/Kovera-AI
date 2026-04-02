import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(queryParams.get('role') === 'admin' ? 'admin' : 'worker');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form State
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
          // Defaults for new riders, can be updated later from proper profile dashboard
          preferredWorkingHours: { start: '09:00', end: '18:00', shift: 'Flexible' },
          avgWeeklyEarnings: 3000
        });
        
    if (!res.success) setErrorMsg(res.message);
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          {isLogin ? 'Welcome Back' : 'Join GigShield'}
        </h2>

        {/* Role Toggle */}
        <div style={{ display: 'flex', marginBottom: '24px', background: 'var(--bg-input)', borderRadius: '8px', padding: '4px' }}>
           <button 
             style={{ flex: 1, padding: '10px', borderRadius: '4px', background: role === 'worker' ? 'var(--accent-gradient)' : 'transparent', color: role==='worker'?'white': 'var(--text-muted)', border:'none', cursor:'pointer' }}
             onClick={() => setRole('worker')}
             type="button"
           >Driver</button>
           <button 
             style={{ flex: 1, padding: '10px', borderRadius: '4px', background: role === 'admin' ? 'var(--premium-gradient)' : 'transparent', color: role==='admin'?'white': 'var(--text-muted)', border:'none', cursor:'pointer' }}
             onClick={() => setRole('admin')}
             type="button"
           >Partner / Admin</button>
        </div>

        {errorMsg && <div className="badge badge-error" style={{ marginBottom: '16px', display: 'block', textAlign: 'center' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required onChange={handleChange} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required onChange={handleChange} />
          </div>

          {!isLogin && role === 'worker' && (
            <>
              <div className="form-group">
                <label className="form-label">Delivery Platform</label>
                <select name="deliveryPlatform" className="form-select" onChange={handleChange}>
                  <option>Swiggy</option>
                  <option>Zomato</option>
                  <option>Zepto</option>
                  <option>Blinkit</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Primary Zone</label>
                <select name="primaryZone" className="form-select" onChange={handleChange}>
                  <option>T. Nagar</option>
                  <option>Velachery</option>
                  <option>Adyar</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
