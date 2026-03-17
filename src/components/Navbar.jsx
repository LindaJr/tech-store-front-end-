import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const categories = ['Electronics & Gadgets', 'Computers & Laptops', 'Cellphones & Accessories', 'Appliances'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="navbar-wrapper">
      {/* Top bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <span>📦 Free delivery on orders over R10,000</span>
          <div className="topbar-links">
            <Link to="/orders">Track Order</Link>
            <span>|</span>
            <Link to="/contact">Contact Us</Link>
            {user?.role === 'admin' && <><span>|</span><Link to="/admin">Admin Panel</Link></>}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <div>
              <span className="logo-main">TechStore</span>
              <span className="logo-sub">powered by innovation</span>
            </div>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text" placeholder="Search products, brands, categories..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <button className="user-btn">
                  <span className="user-avatar">{user.name[0].toUpperCase()}</span>
                  <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/orders">My Orders</Link>
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            )}

            <Link to="/cart" className="cart-btn">
              <span className="cart-icon">🛒</span>
              {cart.count > 0 && <span className="cart-badge">{cart.count}</span>}
              <span className="hide-mobile cart-label">
                <small>Cart</small>
                <strong>R{cart.total.toLocaleString()}</strong>
              </span>
            </Link>
          </div>

          <button className="hamburger show-mobile" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      {/* Category nav */}
      <div className="cat-nav">
        <div className="container cat-nav-inner">
          <Link to="/products" className={`cat-link ${location.pathname === '/products' && !location.search ? 'active' : ''}`}>
            ALL PRODUCTS
          </Link>
          {categories.map(cat => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}
              className={`cat-link ${location.search.includes(encodeURIComponent(cat)) ? 'active' : ''}`}>
              {cat.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
