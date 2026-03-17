import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', originalPrice: '', stock: '', description: '', image: '', badge: '', imageFile: null });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const CATS = ['Electronics & Gadgets', 'Computers & Laptops', 'Cellphones & Accessories', 'Appliances'];
  const STATUS_OPT = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/'); return; }
    loadAll();
  }, [user, navigate]);

  const loadAll = async () => {
    setLoading(true);
    const [p, o] = await Promise.all([api.get('/products?limit=100'), api.get('/orders')]);
    setProducts(p.data.products);
    setOrders(o.data);
    setLoading(false);
  };

  const openAdd = () => { setEditProduct(null); setForm({ name:'', category:'', price:'', originalPrice:'', stock:'', description:'', image:'', badge:'', imageFile: null }); setShowForm(true); };
  const openEdit = (p) => { setEditProduct(p); setForm({ name:p.name, category:p.category, price:p.price, originalPrice:p.originalPrice, stock:p.stock, description:p.description, image:p.image, badge:p.badge||'', imageFile: null }); setShowForm(true); };

  const saveProduct = async () => {
    if (!form.name || !form.category || !form.price) { setMsg('Name, category and price are required'); return; }
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'imageFile') {
          if (form[key]) data.append(key, form[key]);
        } else {
          data.append(key, form[key]);
        }
      });

      if (editProduct) await api.put(`/products/${editProduct.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      setMsg(editProduct ? 'Product updated!' : 'Product added!');
      setShowForm(false);
      await loadAll();
    } catch (e) { setMsg(e.response?.data?.error || 'Save failed'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    await loadAll();
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    await loadAll();
  };

  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0),
    pending: orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length,
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <span className="admin-badge">🔑 Administrator</span>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Products', value: stats.products, icon: '📦', color: '#0066cc' },
            { label: 'Total Orders', value: stats.orders, icon: '🛒', color: '#00a651' },
            { label: 'Revenue', value: `R${stats.revenue.toLocaleString()}`, icon: '💰', color: '#E30613' },
            { label: 'Pending Orders', value: stats.pending, icon: '⏳', color: '#e67e00' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ '--stat-color': s.color }}>
              <span className="stat-icon">{s.icon}</span>
              <div><p className="stat-value">{s.value}</p><p className="stat-label">{s.label}</p></div>
            </div>
          ))}
        </div>

        {msg && <div className={`admin-msg ${msg.includes('!') ? 'success' : 'error'}`}>{msg}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products ({products.length})</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <h2>Product Management</h2>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
            </div>

            {showForm && (
              <div className="admin-form-card">
                <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="admin-form-grid">
                  <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      <option value="">Select...</option>
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Price (R) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} /></div>
                  <div className="form-group"><label>Original Price (R)</label><input type="number" value={form.originalPrice} onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))} /></div>
                  <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} /></div>
                  <div className="form-group"><label>Badge</label><input value={form.badge} placeholder="e.g. Hot Deal" onChange={e => setForm(f => ({...f, badge: e.target.value}))} /></div>
                  <div className="form-group full">
                    <label>Image Upload (or keep existing URL)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="file" accept="image/*" onChange={e => setForm(f => ({...f, imageFile: e.target.files[0]}))} />
                      <input value={form.image} placeholder="Or enter URL..." onChange={e => setForm(f => ({...f, image: e.target.value}))} />
                    </div>
                  </div>
                  <div className="form-group full"><label>Description</label><textarea value={form.description} rows={3} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={saveProduct} disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
                </div>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} alt={p.name} className="table-img" /></td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="cat-chip">{p.category}</span></td>
                      <td className="price-cell">R{p.price.toLocaleString()}</td>
                      <td><span className={`stock-chip ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'}`}>{p.stock}</span></td>
                      <td>
                        <button className="table-btn edit" onClick={() => openEdit(p)}>Edit</button>
                        <button className="table-btn delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="tab-heading">Order Management</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><strong>#{o.id.split('-')[0].toUpperCase()}</strong></td>
                      <td><div>{o.customerName}</div><small style={{color:'var(--gray-400)'}}>{o.customerEmail}</small></td>
                      <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                      <td className="price-cell">R{o.total.toLocaleString()}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-ZA')}</td>
                      <td>
                        <select className="status-select" value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}>
                          {STATUS_OPT.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
