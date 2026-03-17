import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'register') {
      if (!form.name) { setError('Please enter your name'); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>⚡</span>
          <span>TechStore</span>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>
            Sign In
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
            </div>
          )}

          {error && <div className="auth-error">⚠ {error}</div>}

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <div className="auth-hint">
            <p>Demo admin: <strong>admin@techstore.co.za</strong> / <strong>admin123</strong></p>
          </div>
        )}

        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
