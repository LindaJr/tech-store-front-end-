import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_COLORS = {
  confirmed: { bg: '#e8f4fd', color: '#0066cc', label: '✓ Confirmed' },
  processing: { bg: '#fff8e1', color: '#e67e00', label: '⚙ Processing' },
  shipped: { bg: '#f0f9ff', color: '#0099cc', label: '🚚 Shipped' },
  delivered: { bg: '#e8f9f0', color: '#00a651', label: '✅ Delivered' },
  cancelled: { bg: '#fde8e8', color: '#E30613', label: '✗ Cancelled' },
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <span>📦</span>
            <h3>No orders yet</h3>
            <p>Once you place an order, it will appear here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className={`order-card ${isOpen ? 'open' : ''}`}>
                  <div className="order-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div className="order-meta">
                      <div className="order-id">#{order.id.split('-')[0].toUpperCase()}</div>
                      <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <img key={item.productId} src={item.image} alt={item.name} className="preview-img" />
                      ))}
                      {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                    </div>
                    <div className="order-right">
                      <span className="order-status-badge" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                      <span className="order-total">R{order.total.toLocaleString()}</span>
                      <span className="order-chevron">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="order-detail">
                      <div className="order-items-list">
                        {order.items.map(item => (
                          <div key={item.productId} className="order-item-row">
                            <img src={item.image} alt={item.name} />
                            <div>
                              <p className="order-item-name">{item.name}</p>
                              <p className="order-item-qty">Quantity: {item.quantity}</p>
                            </div>
                            <span>R{item.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-breakdown">
                        <div className="breakdown-row"><span>Subtotal</span><span>R{order.subtotal.toLocaleString()}</span></div>
                        <div className="breakdown-row"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : `R${order.shipping}`}</span></div>
                        <div className="breakdown-row total"><span>Total</span><span>R{order.total.toLocaleString()}</span></div>
                      </div>
                      <div className="order-shipping-info">
                        <strong>Ship to:</strong> {order.shippingAddress}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
