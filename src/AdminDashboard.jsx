import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader, getUsername, logout } from './authUtils';

function AdminDashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const username = getUsername();

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users/profile', {
        headers: getAuthHeader()
      });
      setMessage(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch admin data. Please login again.');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('You have been logged out.');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Page Header */}
      <header style={{ 
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '36px',
          fontWeight: '600',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '40px' }}>⚙️</span>
          Admin Dashboard
        </h2>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: '#6c757d'
        }}>
          Welcome, <strong style={{ color: '#495057' }}>{username}</strong>! You have administrative access to manage the platform.
        </p>
      </header>

      {/* Admin Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* User Management Card */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e9ecef', 
          padding: '28px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>👥</div>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '22px',
            fontWeight: '600',
            color: '#1a1a1a',
            textAlign: 'center'
          }}>User Management</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#007bff';
            }}
            >View All Users</button>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#007bff';
            }}
            >Manage Sellers</button>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#007bff';
            }}
            >User Analytics</button>
          </div>
        </div>

        {/* Product Management Card */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e9ecef', 
          padding: '28px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>📦</div>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '22px',
            fontWeight: '600',
            color: '#1a1a1a',
            textAlign: 'center'
          }}>Product Management</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#198754',
              border: '2px solid #198754',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#198754';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#198754';
            }}
            >View All Products</button>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#198754',
              border: '2px solid #198754',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#198754';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#198754';
            }}
            >Moderate Products</button>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#198754',
              border: '2px solid #198754',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#198754';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#198754';
            }}
            >Product Analytics</button>
          </div>
        </div>

        {/* System Management Card */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e9ecef', 
          padding: '28px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>🔧</div>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '22px',
            fontWeight: '600',
            color: '#1a1a1a',
            textAlign: 'center'
          }}>System Management</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            <button 
              onClick={fetchAdminData}
              style={{ 
                padding: '12px 20px',
                backgroundColor: 'transparent',
                color: '#6f42c1',
                border: '2px solid #6f42c1',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6f42c1';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6f42c1';
              }}
            >Test Admin Access</button>
            <button style={{ 
              padding: '12px 20px',
              backgroundColor: 'transparent',
              color: '#6f42c1',
              border: '2px solid #6f42c1',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#6f42c1';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6f42c1';
            }}
            >System Settings</button>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '12px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: '2px solid #dc3545',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#bb2d3b';
                e.target.style.borderColor = '#bb2d3b';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.borderColor = '#dc3545';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
              }}
            >Logout</button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{ 
          padding: '20px',
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #007bff'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: '#495057',
              lineHeight: '1.6'
            }}>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
