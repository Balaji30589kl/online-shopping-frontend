import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/users/login', formData);
      
      if (response.data.token) {
        // Store token, username, and role in localStorage
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userRole', response.data.role);
        // Save userId for API calls
        localStorage.setItem('userId', response.data.userId);
        // Save sellerId for seller dashboard
        localStorage.setItem('sellerId', response.data.userId);
        
        setMessage(`Welcome back, ${response.data.username}!`);
        setFormData({ usernameOrEmail: '', password: '' });
        
        // Notify parent component of successful login
        if (onLoginSuccess) {
          setTimeout(() => onLoginSuccess(), 1000);
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '8px',
          color: '#1a1a1a',
          fontSize: '28px',
          fontWeight: '600'
        }}>User Login</h2>
        <p style={{
          textAlign: 'center',
          marginBottom: '32px',
          color: '#6c757d',
          fontSize: '14px'
        }}>Welcome back! Please login to your account.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>
          
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
            }}
          >
            Login
          </button>
        </form>
        
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            backgroundColor: message.includes('Welcome') ? '#d4edda' : '#f8d7da',
            color: message.includes('Welcome') ? '#155724' : '#721c24',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
