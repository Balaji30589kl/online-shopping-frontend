import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader, getUsername, logout } from './authUtils';
import ProductList from './ProductList';
import Cart from './Cart';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';

function UserDashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const username = getUsername();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users/profile', {
        headers: getAuthHeader()
      });
      setMessage(response.data);
    } catch {
      setMessage('Failed to fetch user data. Please login again.');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('You have been logged out.');
    if (onLogout) {
      onLogout();
    }
  };

  const handleCheckout = () => {
    setActiveTab('checkout');
  };

  const handleOrderPlaced = () => {
    setActiveTab('orders');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>User Dashboard</h2>
        <p>Welcome, <strong>{username}</strong>! Browse and shop for products.</p>
      </header>

      {/* Navigation Tabs */}
      <div style={{ 
        marginBottom: '24px', 
        borderBottom: '2px solid #e9ecef',
        display: 'flex',
        gap: '8px',
        paddingBottom: '4px'
      }}>
        <button 
          onClick={() => setActiveTab('browse')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'browse' ? '#007bff' : 'transparent',
            color: activeTab === 'browse' ? 'white' : '#495057',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'browse' ? '600' : '500',
            fontSize: '15px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'browse' ? '0 -2px 8px rgba(0, 123, 255, 0.2)' : 'none',
            transform: activeTab === 'browse' ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'browse') {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'browse') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#495057';
            }
          }}
        >
          Browse Products
        </button>
        <button 
          onClick={() => setActiveTab('cart')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'cart' ? '#007bff' : 'transparent',
            color: activeTab === 'cart' ? 'white' : '#495057',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'cart' ? '600' : '500',
            fontSize: '15px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'cart' ? '0 -2px 8px rgba(0, 123, 255, 0.2)' : 'none',
            transform: activeTab === 'cart' ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'cart') {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'cart') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#495057';
            }
          }}
        >
          My Cart
        </button>
        <button 
          onClick={() => setActiveTab('checkout')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'checkout' ? '#007bff' : 'transparent',
            color: activeTab === 'checkout' ? 'white' : '#495057',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'checkout' ? '600' : '500',
            fontSize: '15px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'checkout' ? '0 -2px 8px rgba(0, 123, 255, 0.2)' : 'none',
            transform: activeTab === 'checkout' ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'checkout') {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'checkout') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#495057';
            }
          }}
        >
          Checkout
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'orders' ? '#007bff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#495057',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'orders' ? '600' : '500',
            fontSize: '15px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'orders' ? '0 -2px 8px rgba(0, 123, 255, 0.2)' : 'none',
            transform: activeTab === 'orders' ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'orders') {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'orders') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#495057';
            }
          }}
        >
          My Orders
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'account' ? '#007bff' : 'transparent',
            color: activeTab === 'account' ? 'white' : '#495057',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'account' ? '600' : '500',
            fontSize: '15px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'account' ? '0 -2px 8px rgba(0, 123, 255, 0.2)' : 'none',
            transform: activeTab === 'account' ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'account') {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#007bff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'account') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#495057';
            }
          }}
        >
          Account
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'browse' && <ProductList />}
      
      {activeTab === 'cart' && <Cart onCheckout={handleCheckout} />}
      
      {activeTab === 'checkout' && <Checkout onOrderPlaced={handleOrderPlaced} />}
      
      {activeTab === 'orders' && <OrderHistory />}

      {activeTab === 'account' && (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Account Management</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <button 
              onClick={fetchUserData} 
              style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Test User Access
            </button>
            <button 
              style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Update Profile
            </button>
            <button 
              onClick={handleLogout} 
              style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {message && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
