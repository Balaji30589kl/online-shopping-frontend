import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';

function Checkout({ onOrderPlaced }) {
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      // SAFE-FIX: Replaced hardcoded userId=1 with dynamic userId from localStorage.
      const userId = (() => {
        const id = localStorage.getItem("userId");
        if (!id) {
          console.warn("SAFE-FIX WARNING: userId is missing in localStorage. Backend needs to send userId in login response.");
          return null;
        }
        return parseInt(id, 10);
      })();

      if (!userId) {
        alert('Please login to place an order.');
        setLoading(false);
        return;
      }

      // Place order for userId
      const response = await axios.post(
        'http://localhost:8081/api/orders/place',
        {
          userId: userId,
          shippingAddress: shippingAddress
        },
        { headers: getAuthHeader() }
      );

      alert('Order placed successfully!');
      setShippingAddress('');
      
      if (onOrderPlaced) {
        onOrderPlaced(response.data);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          margin: '0',
          fontSize: '32px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>Secure Checkout</h2>
        <p style={{
          margin: '8px 0 0 0',
          color: '#6c757d',
          fontSize: '15px'
        }}>
          Complete your order by providing shipping details
        </p>
      </div>

      {/* Checkout Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        <form onSubmit={handlePlaceOrder}>
          {/* Shipping Address Section */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600',
              fontSize: '16px',
              color: '#1a1a1a'
            }}>
              Shipping Address <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address including street, city, state, and ZIP code..."
              required
              rows="5"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease',
                outline: 'none',
                lineHeight: '1.6'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Order Summary Section */}
          <div style={{
            padding: '24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            marginBottom: '28px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              marginTop: 0,
              marginBottom: '12px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>📦 Order Summary</h3>
            <p style={{ 
              color: '#6c757d',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Review your cart before placing the order. The total amount will be calculated based on your cart items. All prices include applicable taxes.
            </p>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#6c757d' : '#198754',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(25, 135, 84, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#157347';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(25, 135, 84, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#198754';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.3)';
              }
            }}
          >
            {loading ? '⏳ Placing Order...' : '✓ Place Order'}
          </button>

          {/* Security Badge */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#6c757d',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              🔒 <span style={{ fontWeight: '500' }}>Secure Checkout</span> · Your information is encrypted and safe
            </p>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.6'
        }}>
          💡 <strong>Tip:</strong> Orders are typically processed within 24 hours. You'll receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
}

export default Checkout;
