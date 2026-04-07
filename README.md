# TechStore E-Commerce Platform

South Africa's premier tech retailer — inspired by Incredible Connection.
Built with **React** (frontend) + **Node.js/Express** (backend). 

---

## 🚀 Quick Start

### 1. Backend (API Server)
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Frontend (React App)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | admin@techstore.co.za        | admin123   |

Register any new account for customer access.

---

## 📦 Features

### Customer
- 🏠 Homepage with hero slider, category grid, featured products
- 🔍 Product search with filters (category, price, sort)
- 📄 Product detail pages with specs and reviews
- 🛒 Shopping cart with quantity management
- 💳 Multi-step checkout (shipping + payment)
- 📦 Order history with expandable details

### Admin (login required)
- 📊 Dashboard with live stats (revenue, orders, products)
- ➕ Add / Edit / Delete products
- 📋 View all orders, update order status

### Backend API
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| POST   | /api/auth/register        | Register new user       |
| POST   | /api/auth/login           | Login                   |
| GET    | /api/auth/me              | Current user info       |
| GET    | /api/products             | List/filter products    |
| GET    | /api/products/:id         | Single product          |
| POST   | /api/products             | Create product (admin)  |
| PUT    | /api/products/:id         | Update product (admin)  |
| DELETE | /api/products/:id         | Delete product (admin)  |
| GET    | /api/cart                 | Get user cart           |
| POST   | /api/cart/add             | Add to cart             |
| PUT    | /api/cart/update          | Update quantity         |
| DELETE | /api/cart/remove/:id      | Remove item             |
| POST   | /api/orders/checkout      | Place order             |
| GET    | /api/orders/my            | My orders               |
| GET    | /api/orders               | All orders (admin)      |
| PUT    | /api/orders/:id/status    | Update status (admin)   |

---

## 🏗 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Context API
- **Backend**: Node.js, Express 4, bcryptjs, JWT, UUID
- **Styling**: Custom CSS with CSS Variables (Barlow font)
- **Data**: In-memory store (swap with MongoDB/PostgreSQL for production)

## 🔮 Production Upgrades
- Replace in-memory store with MongoDB/PostgreSQL
- Add Stripe/PayFast payment integration
- Add email notifications (nodemailer)
- Add image uploads (Cloudinary/S3)
- Deploy backend on Railway/Render, frontend on Vercel
