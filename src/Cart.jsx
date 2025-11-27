import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';

function Cart({ onCheckout }) {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch cart items and product details
  const fetchCart = async () => {
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
        setLoading(false);
        return;
      }

      // Get cart items for userId
      const cartResponse = await axios.get(`http://localhost:8081/api/cart/user/${userId}`, {
        headers: getAuthHeader()
      });
      
      const items = cartResponse.data;
      setCartItems(items);

      // Fetch product details for each cart item
      const productPromises = items.map(item =>
        axios.get(`http://localhost:8081/api/products/${item.productId}`, {
          headers: getAuthHeader()
        })
      );
      
      const productResponses = await Promise.all(productPromises);
      const productsMap = {};
      productResponses.forEach(res => {
        productsMap[res.data.id] = res.data;
      });
      setProducts(productsMap);

      // Calculate total
      let total = 0;
      items.forEach(item => {
        const product = productsMap[item.productId];
        if (product) {
          total += Number(product.price) * Number(item.quantity);
        }
      });
      setTotalAmount(total);

    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put(
        `http://localhost:8081/api/cart/${cartId}`,
        { quantity: newQuantity },
        { headers: getAuthHeader() }
      );
      fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8081/api/cart/${cartId}`, {
        headers: getAuthHeader()
      });
      fetchCart(); // Refresh cart
      alert('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleProceedToCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        color: '#6c757d'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>🛒</div>
        <p style={{ fontSize: '18px', margin: '0' }}>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
          opacity: '0.5'
        }}>🛒</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '12px'
        }}>Your Cart is Empty</h2>
        <p style={{
          fontSize: '16px',
          color: '#6c757d',
          lineHeight: '1.6'
        }}>Add some products to your cart to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <h2 style={{
          margin: '0',
          fontSize: '32px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>Shopping Cart</h2>
        <p style={{
          margin: '8px 0 0 0',
          color: '#6c757d',
          fontSize: '15px'
        }}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        {/* Cart Items */}
        <div>
          {cartItems.map(item => {
            const product = products[item.productId];
            if (!product) return null;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                {/* Product Image */}
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/120'}
                  alt={product.name}
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    flexShrink: 0
                  }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/120'; }}
                />
                
                {/* Product Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    lineHeight: '1.3'
                  }}>{product.name}</h3>
                  
                  <p style={{ 
                    color: '#6c757d', 
                    fontSize: '14px', 
                    margin: 0,
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                  
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#198754',
                    marginTop: '4px'
                  }}>
                    ${product.price} <span style={{ fontSize: '14px', fontWeight: '400', color: '#6c757d' }}>each</span>
                  </div>

                  {/* Quantity Controls & Remove Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>Quantity:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '2px solid #e9ecef', borderRadius: '8px', overflow: 'hidden' }}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          style={{ 
                            padding: '8px 14px', 
                            fontSize: '18px', 
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: 'none',
                            color: '#495057',
                            fontWeight: '600',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          −
                        </button>
                        <span style={{ 
                          padding: '8px 16px',
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: '#1a1a1a',
                          minWidth: '50px',
                          textAlign: 'center',
                          borderLeft: '2px solid #e9ecef',
                          borderRight: '2px solid #e9ecef'
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          style={{ 
                            padding: '8px 14px', 
                            fontSize: '18px', 
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: 'none',
                            color: '#495057',
                            fontWeight: '600',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#dc3545',
                        border: '2px solid #dc3545',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        marginLeft: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#dc3545';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                {/* Item Total */}
                <div style={{ 
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  minWidth: '120px'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6c757d',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>Item Total</div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '700',
                      color: '#1a1a1a'
                    }}>
                      ${(Number(product.price) * Number(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div style={{
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              paddingBottom: '16px',
              borderBottom: '2px solid #e9ecef'
            }}>Order Summary</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '15px',
                color: '#495057'
              }}>
                <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                <span style={{ fontWeight: '600' }}>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '15px',
                color: '#495057'
              }}>
                <span>Shipping</span>
                <span style={{ fontWeight: '600', color: '#198754' }}>Free</span>
              </div>
              
              <div style={{
                borderTop: '2px solid #e9ecef',
                marginTop: '16px',
                paddingTop: '16px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>Total</span>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: '700',
                    color: '#198754'
                  }}>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#198754',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(25, 135, 84, 0.3)',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#157347';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(25, 135, 84, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#198754';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.3)';
              }}
            >
              Proceed to Checkout
            </button>
            
            <p style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#6c757d',
              marginTop: '16px',
              marginBottom: '0'
            }}>
              🔒 Secure checkout powered by Shopping Hub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
