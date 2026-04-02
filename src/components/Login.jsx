import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LockKey, User, ShieldCheck, IdentificationCard } from '@phosphor-icons/react';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const autoFillAndSubmit = (user, pass) => {
    login(user, pass);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '48px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'rgba(124, 58, 237, 0.1)', display: 'inline-flex', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <LockKey size={48} color="var(--accent-primary)" weight="duotone" />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Security Required</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access the Cloud Catalog</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <LockKey size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '48px' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '14px' }}>
            Sign In Securely
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Or use quick demo simulated login:</p>

          <button onClick={() => autoFillAndSubmit('admin', 'admin123')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <ShieldCheck size={20} color="var(--accent-primary)" weight="duotone" />
            Login as Administrator
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>admin / admin123</span>
          </button>

          <button onClick={() => autoFillAndSubmit('employee', 'employee123')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <IdentificationCard size={20} color="var(--accent-success)" weight="duotone" />
            Login as Employee
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>employee / employee123</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
