import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { name: 'Electronics & Gadgets', icon: '🎧', color: '#E30613' },
  { name: 'Computers & Laptops', icon: '💻', color: '#1a1a1a' },
  { name: 'Cellphones & Accessories', icon: '📱', color: '#0066cc' },
  { name: 'Appliances', icon: '📺', color: '#00a651' },
];

const heroSlides = [
  {
    title: 'Next-Gen Technology', subtitle: 'At Unbeatable Prices',
    desc: 'Discover the latest in electronics, laptops, smartphones & more.',
    cta: 'Shop Now', link: '/products',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a0000 50%, #E30613 100%)',
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600',
  },
  {
    title: 'iPhone 15 Pro Max', subtitle: 'Titanium. So strong. So light.',
    desc: 'The most powerful iPhone ever made. Available now.',
    cta: 'View Deal', link: '/products?category=Cellphones+%26+Accessories',
    bg: 'linear-gradient(135deg, #000 0%, #1a1a2e 50%, #16213e 100%)',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
  },
  {
    title: 'MacBook Air M3', subtitle: 'Supercharged for what\'s next',
    desc: 'Up to 18-hour battery. Impossibly thin. Starts from R24,999.',
    cta: 'Shop Laptops', link: '/products?category=Computers+%26+Laptops',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #444 100%)',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?sort=rating&limit=8').then(r => setFeatured(r.data.products));
    api.get('/products?sort=rating&limit=4').then(r => setDeals(r.data.products));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = heroSlides[slide];

  return (
    <div className="home">
      {/* Hero Slider */}
      <section className="hero" style={{ background: s.bg }}>
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow">🔥 Exclusive Online Deals</div>
            <h1>{s.title}</h1>
            <h2>{s.subtitle}</h2>
            <p>{s.desc}</p>
            <div className="hero-btns">
              <Link to={s.link} className="btn btn-primary btn-lg">{s.cta}</Link>
              <Link to="/products" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                Browse All
              </Link>
            </div>
          </div>
          <div className="hero-img">
            <img src={s.img} alt={s.title} />
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="container trust-inner">
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'Orders over R10,000' },
            { icon: '🔄', title: '30-Day Returns', sub: 'Hassle-free returns' },
            { icon: '🔒', title: 'Secure Payment', sub: 'Encrypted checkout' },
            { icon: '🛡️', title: 'Official Warranty', sub: 'All products covered' },
            { icon: '💬', title: '24/7 Support', sub: 'We\'re always here' },
          ].map(t => (
            <div key={t.title} className="trust-item">
              <span className="trust-icon">{t.icon}</span>
              <div><strong>{t.title}</strong><small>{t.sub}</small></div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">View All →</Link>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="cat-card" style={{ '--cat-color': cat.color }}>
                <span className="cat-card-icon">{cat.icon}</span>
                <span className="cat-card-name">{cat.name}</span>
                <span className="cat-card-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>⭐ Top Rated Products</h2>
            <Link to="/products?sort=rating" className="see-all">See All →</Link>
          </div>
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-red" onClick={() => navigate('/products?category=Cellphones+%26+Accessories')}>
              <div>
                <p className="promo-eyebrow">Weekend Special</p>
                <h3>Smartphones</h3>
                <p>Up to 15% off selected models</p>
                <span className="btn btn-dark btn-sm">Shop Now</span>
              </div>
              <span className="promo-emoji">📱</span>
            </div>
            <div className="promo-card promo-dark" onClick={() => navigate('/products?category=Computers+%26+Laptops')}>
              <div>
                <p className="promo-eyebrow">Limited Stock</p>
                <h3>Laptops & PCs</h3>
                <p>Premium brands, pro performance</p>
                <span className="btn btn-primary btn-sm">Explore</span>
              </div>
              <span className="promo-emoji">💻</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="section bg-dark">
        <div className="container">
          <div className="section-header light">
            <h2>🔥 Hot Deals</h2>
            <Link to="/products?sort=price_asc" className="see-all light">See All Deals →</Link>
          </div>
          <div className="products-grid">
            {deals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
