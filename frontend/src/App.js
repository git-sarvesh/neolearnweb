import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import NotesPage from './components/NotesPage';
import './styles/theme.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser({ 
          token: token, 
          user: JSON.parse(userData) 
        });
      } catch (err) {
        console.error('Error loading user data:', err);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleAuth = (data) => {
    console.log('🔐 Auth successful, saving data:', data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data);
  };

  const handleLogout = () => {
    console.log('👋 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app">
      {!user ? (
        <AuthForm onAuth={handleAuth} />
      ) : (
        <NotesPage 
          token={user.token} 
          user={user.user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
