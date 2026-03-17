import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo"><span>⚡</span> TechStore</div>
            <p>South Africa's premier electronics retailer. Quality products, expert service, unbeatable prices.</p>
            <div className="footer-socials">
              <a href="#fb">📘</a><a href="#tw">🐦</a><a href="#ig">📸</a><a href="#yt">▶️</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products?category=Electronics+%26+Gadgets">Electronics & Gadgets</Link>
            <Link to="/products?category=Computers+%26+Laptops">Computers & Laptops</Link>
            <Link to="/products?category=Cellphones+%26+Accessories">Cellphones & Accessories</Link>
            <Link to="/products?category=Appliances">Appliances</Link>
          </div>

          <div className="footer-col">
            <h4>Customer Service</h4>
            <Link to="/orders">Track My Order</Link>
            <Link to="/contact">Contact Us</Link>
            <a href="#faq">FAQ</a>
            <a href="#returns">Returns Policy</a>
            <a href="#warranty">Warranty</a>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <a href="#about">About TechStore</a>
            <a href="#careers">Careers</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} TechStore (Pty) Ltd. All rights reserved.</p>
          <div className="payment-icons">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>🏦 EFT</span>
            <span>📱 SnapScan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
