import React, { useState } from 'react';
import axios from 'axios';
import './UserRegistration.css';

function UserRegistration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER' // Default role is USER
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
      const response = await axios.post('http://localhost:8081/api/users/register', formData);
      setMessage(response.data);
      // Clear form on successful registration
      setFormData({ username: '', email: '', password: '', role: 'USER' });
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
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
        }}>User Registration</h2>
        <p style={{
          textAlign: 'center',
          marginBottom: '32px',
          color: '#6c757d',
          fontSize: '14px'
        }}>Create your account to get started.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
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
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
          
          <div style={{ marginBottom: '20px' }}>
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
          
          <div style={{ marginBottom: '24px' }}>
            <select
              name="role"
              value={formData.role}
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
                cursor: 'pointer',
                boxSizing: 'border-box',
                color: '#495057'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              <option value="USER">Customer</option>
              <option value="SELLER">Seller</option>
              <option value="ADMIN">Admin</option>
            </select>
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
            Register
          </button>
        </form>
        
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24',
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

export default UserRegistration;
