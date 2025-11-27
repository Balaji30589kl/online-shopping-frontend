import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader, isLoggedIn, logout } from './authUtils';

function Profile() {
  const [profileMessage, setProfileMessage] = useState('');

  const fetchProfile = async () => {
    if (!isLoggedIn()) {
      setProfileMessage('Please login first!');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8081/api/users/profile', {
        headers: getAuthHeader()
      });
      setProfileMessage(response.data);
    } catch (error) {
      console.error(error);
      setProfileMessage('Failed to fetch profile. Please login again.');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileMessage('You have been logged out.');
  };

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{
          margin: '0 0 24px 0',
          fontSize: '28px',
          fontWeight: '600',
          color: '#1a1a1a',
          textAlign: 'center'
        }}>User Profile</h3>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button 
            onClick={fetchProfile}
            style={{ 
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
            }}
          >
            Get Profile Info
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '12px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#bb2d3b';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
            }}
          >
            Logout
          </button>
        </div>
        
        {profileMessage && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            borderLeft: '4px solid #007bff'
          }}>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: '#495057',
              lineHeight: '1.6'
            }}>{profileMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
