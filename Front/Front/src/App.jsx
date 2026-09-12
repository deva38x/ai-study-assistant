import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'register'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setAuthPage('login');
  };

  if (!isAuthenticated) {
    return (
      <div className={`auth-container ${authPage === 'register' ? 'auth-container--register' : ''}`}>
        {authPage === 'login' ? (
          <Login 
            onSuccess={handleAuthSuccess} 
            onSwitchToRegister={() => setAuthPage('register')}
          />
        ) : (
          <Register 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthPage('login')}
          />
        )}
      </div>
    );
  }

  return (
    <Dashboard onLogout={handleLogout} />
  );
}

export default App;