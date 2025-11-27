import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const fetchOrders = async () => {
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

      // Get orders for userId
      const response = await axios.get(`http://localhost:8081/api/orders/user/${userId}`, {
        headers: getAuthHeader()
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderDetails = async (orderId) => {
    const newExpanded = new Set(expandedOrders);
    
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      
      // Fetch order items if not already loaded
      if (!orderItems[orderId]) {
        try {
          const itemsResponse = await axios.get(
            `http://localhost:8081/api/orders/${orderId}/items`,
            { headers: getAuthHeader() }
          );
          
          const items = itemsResponse.data;
          setOrderItems(prev => ({ ...prev, [orderId]: items }));

          // Fetch product details for each item
          const productPromises = items.map(item =>
            axios.get(`http://localhost:8081/api/products/${item.productId}`, {
              headers: getAuthHeader()
            })
          );
          
          const productResponses = await Promise.all(productPromises);
          const productsMap = { ...products };
          productResponses.forEach(res => {
            productsMap[res.data.id] = res.data;
          });
          setProducts(productsMap);

        } catch (error) {
          console.error('Error fetching order items:', error);
        }
      }
    }
    
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#17a2b8';
      case 'SHIPPED': return '#007bff';
      case 'DELIVERED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
        <p style={{ 
          fontSize: '18px', 
          color: '#6c757d',
          margin: 0 
        }}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '12px' 
        }}>No Orders Yet</h2>
        <p style={{ 
          fontSize: '16px',
          color: '#6c757d',
          margin: 0,
          lineHeight: '1.6' 
        }}>You haven't placed any orders. Start shopping to see your order history!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Page Header */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <h2 style={{
          margin: '0',
          fontSize: '32px',
          fontWeight: '600',
          color: '#1a1a1a'
        }}>Order History</h2>
        <p style={{
          margin: '8px 0 0 0',
          color: '#6c757d',
          fontSize: '15px'
        }}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              backgroundColor: 'white',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
          >
            {/* Order Header */}
            <div
              onClick={() => toggleOrderDetails(order.id)}
              style={{
                padding: '24px',
                cursor: 'pointer',
                backgroundColor: expandedOrders.has(order.id) ? '#f8f9fa' : 'white',
                borderBottom: expandedOrders.has(order.id) ? '2px solid #e9ecef' : 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
                      Order #{order.id}
                    </h3>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                  <p style={{ margin: '0 0 8px 0', color: '#6c757d', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span> {formatDate(order.orderDate)}
                  </p>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontSize: '16px', marginTop: '1px' }}>📍</span>
                    <span><strong style={{ color: '#495057' }}>Shipping to:</strong> {order.shippingAddress}</span>
                  </p>
                </div>
                
                <div style={{ textAlign: 'right', minWidth: '140px' }}>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>
                    Order Total
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#198754', lineHeight: '1' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '16px', 
                paddingTop: '16px',
                borderTop: '1px solid #e9ecef',
                color: '#007bff', 
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>{expandedOrders.has(order.id) ? '▼' : '▶'}</span>
                <span>{expandedOrders.has(order.id) ? 'Hide Order Details' : 'Show Order Details'}</span>
              </div>
            </div>

            {/* Order Items (Expanded) */}
            {expandedOrders.has(order.id) && orderItems[order.id] && (
              <div style={{ padding: '24px', backgroundColor: '#fafbfc' }}>
                <h4 style={{ 
                  marginTop: 0, 
                  marginBottom: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Order Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orderItems[order.id].map(item => {
                    const product = products[item.productId];
                    if (!product) return null;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '16px',
                          padding: '16px',
                          backgroundColor: 'white',
                          border: '1px solid #e9ecef',
                          borderRadius: '10px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          transition: 'box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        }}
                      >
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/90'}
                          alt={product.name}
                          style={{ 
                            width: '90px', 
                            height: '90px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '1px solid #e9ecef',
                            flexShrink: 0
                          }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/90'; }}
                        />
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            lineHeight: '1.3'
                          }}>{product.name}</h4>
                          <p style={{ 
                            margin: 0, 
                            color: '#6c757d', 
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              backgroundColor: '#e9ecef',
                              padding: '2px 10px',
                              borderRadius: '12px',
                              fontWeight: '500',
                              fontSize: '13px'
                            }}>Qty: {item.quantity}</span>
                            <span style={{ color: '#198754', fontWeight: '600' }}>
                              ${Number(item.price).toFixed(2)} each
                            </span>
                          </p>
                        </div>
                        
                        <div style={{ 
                          textAlign: 'right',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minWidth: '100px'
                        }}>
                          <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px', fontWeight: '500' }}>
                            Item Total
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                            ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
