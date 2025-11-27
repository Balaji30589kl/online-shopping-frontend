import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from './authUtils';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/products', {
        headers: getAuthHeader()
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
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

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const categories = [...new Set(products.map(product => product.category))];

  const handleAddToCart = async (product) => {
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
        alert('Please login to add items to cart.');
        return;
      }

      await axios.post(
        'http://localhost:8081/api/cart/add',
        {
          userId: userId,
          productId: product.id,
          quantity: 1
        },
        { headers: getAuthHeader() }
      );
      alert(`Added "${product.name}" to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <h2>Browse Products</h2>

      {/* Search and Filter Section */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ minWidth: '150px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      <p style={{ marginBottom: '20px', color: '#666' }}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No products found matching your search criteria.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredProducts.map((product) => {
            const stockCount = Number(product.stock);
            const inStock = stockCount > 0;

            return (
              <div
                key={product.id}
                style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '12px', 
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ marginBottom: '16px', textAlign: 'center', position: 'relative' }}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #f0f0f0',
                        filter: inStock ? 'none' : 'grayscale(100%) opacity(0.6)'
                      }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/280x200?text=No+Image'; }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #e0e0e0'
                    }}>
                      No Image
                    </div>
                  )}
                </div>

                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1a1a1a',
                  lineHeight: '1.3'
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  margin: '0 0 12px 0', 
                  color: '#757575', 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  minHeight: '42px'
                }}>
                  {product.description && product.description.length > 100
                    ? product.description.substring(0, 100) + '...'
                    : product.description || 'No description available'}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '16px',
                  gap: '8px'
                }}>
                  <span style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {product.category}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    backgroundColor: inStock ? '#d4edda' : '#f8d7da',
                    color: inStock ? '#155724' : '#721c24'
                  }}>
                    {inStock ? `${stockCount} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '16px'
                }}>
                  <span style={{ 
                    fontSize: '28px', 
                    fontWeight: '700', 
                    color: '#198754',
                    letterSpacing: '-0.5px'
                  }}>
                    ${product.price}
                  </span>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!inStock}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: inStock ? '#198754' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: inStock ? '0 2px 4px rgba(25, 135, 84, 0.3)' : 'none',
                      opacity: inStock ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => {
                      if (inStock) {
                        e.currentTarget.style.backgroundColor = '#157347';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(25, 135, 84, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (inStock) {
                        e.currentTarget.style.backgroundColor = '#198754';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(25, 135, 84, 0.3)';
                      }
                    }}
                  >
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductList;
