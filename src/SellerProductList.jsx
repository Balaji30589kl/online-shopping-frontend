import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';
import ProductForm from './ProductForm';

function SellerProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch seller's products on component load
  const fetchProducts = async () => {
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

      // Fetch seller's products
      const response = await axios.get(
        `http://localhost:8081/api/products/seller/${userId}`,
        { headers: getAuthHeader() }
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/api/products/${productId}`, {
        headers: getAuthHeader(),
      });
      alert('Product deleted successfully!');
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e9ecef',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 4px 0',
            fontSize: '32px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>My Products</h2>
          <p style={{ 
            margin: 0,
            fontSize: '15px',
            color: '#6c757d'
          }}>
            Manage your product inventory
          </p>
        </div>
        <button 
          onClick={handleAddProduct}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#198754', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(25, 135, 84, 0.3)'
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
          + Add New Product
        </button>
      </div>

      {showForm && (
        <ProductForm 
          existingProduct={editingProduct} 
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ fontSize: '18px', color: '#6c757d', margin: 0 }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>
            No Products Yet
          </h3>
          <p style={{ fontSize: '16px', color: '#6c757d', margin: 0 }}>
            Add your first product to get started!
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Desktop Table View */}
          <div style={{ overflowX: 'auto', display: 'block' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Image</th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Product</th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Category</th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Price</th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Stock</th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={product.id}
                    style={{
                      borderBottom: index < products.length - 1 ? '1px solid #e9ecef' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '1px solid #e9ecef'
                          }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                        />
                      ) : (
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>📦</div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', maxWidth: '300px' }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                        {product.name}
                      </div>
                      {product.description && (
                        <div style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.4' }}>
                          {product.description.length > 60 
                            ? product.description.substring(0, 60) + '...' 
                            : product.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#e7f3ff',
                        color: '#0066cc',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px', color: '#198754' }}>
                        ${product.price}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: product.stock > 10 ? '#d1f4e0' : product.stock > 0 ? '#fff3cd' : '#f8d7da',
                        color: product.stock > 10 ? '#0d6832' : product.stock > 0 ? '#856404' : '#721c24',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'transparent',
                            color: '#007bff', 
                            border: '2px solid #007bff', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
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
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ 
                            padding: '8px 16px', 
                            backgroundColor: 'transparent',
                            color: '#dc3545', 
                            border: '2px solid #dc3545', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
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
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProductList;
