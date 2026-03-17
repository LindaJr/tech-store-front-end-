import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', postalCode: '',
    paymentMethod: 'card',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCheckout = async () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
    for (const f of required) {
      if (!form[f]) { setError(`Please fill in ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`); return; }
    }
    setError(''); setLoading(true);
    try {
      const shippingAddress = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.province} ${form.postalCode}`;
      const res = await api.post('/orders/checkout', { shippingAddress, paymentMethod: form.paymentMethod });
      setOrder(res.data.order);
      await fetchCart();
      setStep(3);
    } catch (e) {
      setError(e.response?.data?.error || 'Checkout failed. Please try again.');
    }
    setLoading(false);
  };

  if (cart.items.length === 0 && !order) {
    navigate('/cart'); return null;
  }

  const shipping = cart.total > 10000 ? 0 : 149;
  const grandTotal = cart.total + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Progress Steps */}
        <div className="checkout-steps">
          {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }, { n: 3, label: 'Confirmation' }].map(s => (
            <div key={s.n} className={`step ${step >= s.n ? 'done' : ''} ${step === s.n ? 'active' : ''}`}>
              <div className="step-num">{step > s.n ? '✓' : s.n}</div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {step === 3 && order ? (
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <div className="order-ref">Order ID: <strong>{order.id.split('-')[0].toUpperCase()}</strong></div>
            <div className="success-summary">
              {order.items.map(item => (
                <div key={item.productId} className="success-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>R{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
              <div className="success-item total">
                <span>Total Paid</span>
                <span>R{order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>View My Orders</button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/products')}>Continue Shopping</button>
            </div>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-form-wrap">
              {step === 1 && (
                <div className="form-section">
                  <h3>Shipping Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="071 234 5678" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Street Address *</label>
                    <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main Street, Suburb" />
                  </div>
                  <div className="form-row three">
                    <div className="form-group">
                      <label>City *</label>
                      <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Johannesburg" />
                    </div>
                    <div className="form-group">
                      <label>Province *</label>
                      <select value={form.province} onChange={e => set('province', e.target.value)}>
                        <option value="">Select...</option>
                        {['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Limpopo','Mpumalanga','North West','Northern Cape'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Postal Code *</label>
                      <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="2000" />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg next-btn" onClick={() => setStep(2)}>Continue to Payment →</button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <h3>Payment Method</h3>
                  {[
                    { value: 'card', label: '💳 Credit / Debit Card', sub: 'Visa, Mastercard' },
                    { value: 'eft', label: '🏦 Instant EFT', sub: 'Pay via your bank' },
                    { value: 'snapscan', label: '📱 SnapScan', sub: 'Scan & pay' },
                    { value: 'payflex', label: '⚡ PayFlex', sub: 'Pay in 4 instalments' },
                  ].map(pm => (
                    <label key={pm.value} className={`payment-option ${form.paymentMethod === pm.value ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={pm.value}
                        checked={form.paymentMethod === pm.value} onChange={() => set('paymentMethod', pm.value)} />
                      <div>
                        <strong>{pm.label}</strong>
                        <small>{pm.sub}</small>
                      </div>
                    </label>
                  ))}

                  {form.paymentMethod === 'card' && (
                    <div className="card-fields">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry</label>
                          <input placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input placeholder="123" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && <div className="form-error">⚠ {error}</div>}
                  <div className="form-btns">
                    <button className="btn btn-outline btn-lg" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-primary btn-lg" onClick={handleCheckout} disabled={loading}>
                      {loading ? 'Processing...' : `Place Order · R${grandTotal.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              {cart.items.map(item => (
                <div key={item.productId} className="checkout-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div>
                    <p className="checkout-item-name">{item.product.name}</p>
                    <p className="checkout-item-meta">Qty: {item.quantity} × R{item.product.price.toLocaleString()}</p>
                  </div>
                  <span>R{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="checkout-totals">
                <div className="total-row"><span>Subtotal</span><span>R{cart.total.toLocaleString()}</span></div>
                <div className="total-row"><span>Shipping</span><span className={shipping === 0 ? 'free-ship' : ''}>{shipping === 0 ? 'FREE' : `R${shipping}`}</span></div>
                <div className="total-row grand"><span>Total</span><span>R{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
