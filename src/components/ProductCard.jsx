import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
    setAdding(false);
  };

  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
        {product.badge && (
          <span className={`product-badge badge ${
            product.badge === 'Hot Deal' ? 'badge-red' :
            product.badge === 'Best Seller' ? 'badge-yellow' :
            product.badge === 'New' ? 'badge-green' : 'badge-dark'
          }`}>{product.badge}</span>
        )}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <span className="stars">{stars}</span>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-pricing">
          <span className="product-price">R{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="product-original">R{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="stock-warning">⚠️ Only {product.stock} left!</p>
        )}
        {product.stock === 0 && <p className="out-of-stock">Out of Stock</p>}

        <button
          className={`add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
        >
          {added ? '✓ Added!' : adding ? 'Adding...' : '🛒 Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
