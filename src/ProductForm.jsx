import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';

function ProductForm({ existingProduct, onSave, onCancel }) {
  // SAFE-FIX: Replaced hardcoded userId=1 with dynamic userId from localStorage.
  const userId = (() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      console.warn("SAFE-FIX WARNING: userId is missing in localStorage. Backend needs to send userId in login response.");
      return null;
    }
    return parseInt(id, 10);
  })();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    sellerId: userId // Dynamic sellerId from localStorage
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setProduct(existingProduct);
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => (
      { 
        ...prev,
        [name]:
          name === 'price' 
          ? parseFloat(value)||0
          : name === 'stock'
          ? parseInt(value,10)||0
          :value
      }
      ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!product.name || !product.price || !product.stock || !product.category) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      if (product.id) {
        // Update existing product
        await axios.put(
          `http://localhost:8081/api/products/${product.id}`,
          product,
          { headers: getAuthHeader() }
        );
        alert('Product updated successfully!');
      } else {
        // Create new product
        await axios.post(
          'http://localhost:8081/api/products',
          product,
          { headers: getAuthHeader() }
        );
        alert('Product created successfully!');
      }
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      marginBottom: '30px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        width: '100%',
        padding: '32px', 
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{
          textAlign: 'center',
          marginBottom: '8px',
          marginTop: '0',
          color: '#1a1a1a',
          fontSize: '24px',
          fontWeight: '600'
        }}>{product.id ? 'Edit Product' : 'Add New Product'}</h3>
        <p style={{
          textAlign: 'center',
          marginBottom: '32px',
          color: '#6c757d',
          fontSize: '14px',
          marginTop: '0'
        }}>
          {product.id ? 'Update your product information below.' : 'Fill in the details to add a new product.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500'
            }}>Product Name *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500'
            }}>Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box',
                height: '100px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#495057',
                fontSize: '14px',
                fontWeight: '500'
              }}>Price *</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28a745';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#495057',
                fontSize: '14px',
                fontWeight: '500'
              }}>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28a745';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500'
            }}>Category *</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box',
                cursor: 'pointer',
                color: '#495057'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
              <option value="Beauty">Beauty</option>
            </select>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500'
            }}>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: '#f8f9fa',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                flex: onCancel ? '1' : 'auto',
                width: onCancel ? 'auto' : '100%',
                padding: '14px 24px', 
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: loading ? '#6c757d' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(40, 167, 69, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#218838';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
                }
              }}
            >
              {loading ? 'Saving...' : (product.id ? 'Update Product' : 'Add Product')}
            </button>
            
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                style={{ 
                  flex: '1',
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'transparent',
                  color: '#6c757d', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#6c757d';
                  e.target.style.color = '#495057';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.color = '#6c757d';
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
