import React, { useState, useEffect } from 'react';
import UserRegistration from './UserRegistration';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import SellerDashboard from './SellerDashboard';
import UserDashboard from './UserDashboard';
import { isLoggedIn, getUserRole, logout } from './authUtils';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setUserLoggedIn(loggedIn);
    if (loggedIn) {
      setRole(getUserRole());
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setUserLoggedIn(true);
    const userRole = getUserRole();
    setRole(userRole);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    setRole(null);
    setCurrentView('login');
  };

  const renderContent = () => {
    if (!userLoggedIn) {
      if (currentView === 'register') {
        return <UserRegistration />;
      }
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    // Logged in → Dashboard view
    if (role === 'ADMIN') {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    if (role === 'SELLER') {
      return <SellerDashboard onLogout={handleLogout} />;
    }
    // Default to regular user dashboard
    return <UserDashboard onLogout={handleLogout} />;
  };

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <header style={{ 
        backgroundColor: 'white',
        marginBottom: '0',
        borderBottom: '2px solid #e9ecef',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '36px' }}>🛒</span>
            Shopping Hub
          </h1>
          {!userLoggedIn && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setCurrentView('login')}
                disabled={currentView === 'login'}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: currentView === 'login' ? '#e9ecef' : '#007bff',
                  color: currentView === 'login' ? '#6c757d' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: currentView === 'login' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: currentView === 'login' ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (currentView !== 'login') {
                    e.target.style.backgroundColor = '#0056b3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== 'login') {
                    e.target.style.backgroundColor = '#007bff';
                  }
                }}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('register')}
                disabled={currentView === 'register'}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: currentView === 'register' ? '#e9ecef' : 'transparent',
                  color: currentView === 'register' ? '#6c757d' : '#198754',
                  border: currentView === 'register' ? 'none' : '2px solid #198754',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: currentView === 'register' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: currentView === 'register' ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (currentView !== 'register') {
                    e.target.style.backgroundColor = '#198754';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== 'register') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#198754';
                  }
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>
      {renderContent()}
    </div>
  );
}

export default App;
