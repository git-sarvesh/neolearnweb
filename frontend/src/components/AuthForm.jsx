import React, { useState } from 'react';
import '../styles/auth.css';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', emailID: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = `http://localhost:5000/api/auth/${mode}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        onAuth(data);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo">
          <span className="logo-text">NEOLEARN</span>
        </div>
      </div>
      <div className="auth-content">
        <h1>Accelerate Your Learning with NeoLearn AI</h1>
        <p className="subtitle">
          Intelligent note-taking and personalized guidance, powered by NeoLearn.
          <br />
          Students Learning platform
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email ID"
            value={form.emailID}
            onChange={(e) => setForm({ ...form, emailID: e.target.value })}
            required
          />
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          <p className="toggle-mode">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
