import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('desc');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {}
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id, qty);
      navigate('/cart');
    } catch {}
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  const savings = product.originalPrice - product.price;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> /
          <span onClick={() => navigate('/products')}>Products</span> /
          <span onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}>{product.category}</span> /
          <span className="bc-current">{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-img-wrap">
            {discount > 0 && <div className="detail-discount">SAVE {discount}%</div>}
            <img src={product.image} alt={product.name} />
          </div>

          {/* Info */}
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <span className="stars">{stars}</span>
              <span className="detail-rating-text">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="detail-price-block">
              <span className="detail-price">R{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original">R{product.originalPrice.toLocaleString()}</span>
                  <span className="detail-savings">You save R{savings.toLocaleString()}</span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Stock status */}
            <div className={`stock-status ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in'}`}>
              {product.stock === 0 ? '✗ Out of Stock'
                : product.stock <= 5 ? `⚠ Only ${product.stock} units left!`
                : `✓ In Stock (${product.stock} available)`}
            </div>

            {/* Quantity + Buttons */}
            {product.stock > 0 && (
              <div className="detail-actions">
                <div className="qty-selector">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className={`btn btn-primary btn-lg detail-cart-btn ${added ? 'added' : ''}`}
                  onClick={handleAdd} disabled={adding}>
                  {added ? '✓ Added to Cart!' : adding ? 'Adding...' : '🛒 Add to Cart'}
                </button>
                <button className="btn btn-dark btn-lg" onClick={handleBuyNow}>
                  ⚡ Buy Now
                </button>
              </div>
            )}

            {/* Features */}
            <div className="detail-features">
              {[
                { icon: '🚚', text: 'Free delivery on this item' },
                { icon: '🔄', text: '30-day returns policy' },
                { icon: '🛡️', text: 'Official manufacturer warranty' },
              ].map(f => (
                <div key={f.text} className="feature-item">
                  <span>{f.icon}</span><span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {[
              { key: 'desc', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
            ].map(t => (
              <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}>{t.label}</button>
            ))}
          </div>
          <div className="tab-content">
            {tab === 'desc' && (
              <div className="tab-desc">
                <p>{product.description}</p>
              </div>
            )}
            {tab === 'specs' && (
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
