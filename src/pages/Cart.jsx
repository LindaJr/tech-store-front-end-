import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <span>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = cart.total > 10000 ? 0 : 149;
  const grandTotal = cart.total + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span>({cart.count} item{cart.count !== 1 ? 's' : ''})</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.productId} className="cart-item">
                <Link to={`/products/${item.productId}`} className="cart-item-img">
                  <img src={item.product.image} alt={item.product.name} />
                </Link>
                <div className="cart-item-info">
                  <p className="cart-item-cat">{item.product.category}</p>
                  <Link to={`/products/${item.productId}`} className="cart-item-name">
                    {item.product.name}
                  </Link>
                  <p className="cart-item-price">R{item.product.price.toLocaleString()} each</p>
                  {item.product.stock <= 5 && (
                    <p className="cart-item-stock">⚠ Only {item.product.stock} left</p>
                  )}
                </div>
                <div className="cart-item-controls">
                  <div className="qty-selector">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, Math.min(item.product.stock, item.quantity + 1))}>+</button>
                  </div>
                  <p className="cart-item-subtotal">R{(item.product.price * item.quantity).toLocaleString()}</p>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal ({cart.count} items)</span><span>R{cart.total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span>
              <span className={shipping === 0 ? 'free-ship' : ''}>{shipping === 0 ? 'FREE' : `R${shipping}`}</span>
            </div>
            {shipping > 0 && <p className="ship-note">Add R{(10000 - cart.total).toLocaleString()} more for free shipping</p>}
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>R{grandTotal.toLocaleString()}</span></div>
            <button className="btn btn-primary btn-lg checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
