import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Electronics & Gadgets', 'Computers & Laptops', 'Cellphones & Accessories', 'Appliances'];
const SORTS = [
  { value: '', label: 'Featured' }, { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' }, { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', page);
    params.set('limit', 12);

    api.get(`/products?${params}`)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page, minPrice, maxPrice]);

  const update = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const applyPrice = () => {
    const p = new URLSearchParams(searchParams);
    if (priceMin) p.set('minPrice', priceMin); else p.delete('minPrice');
    if (priceMax) p.set('maxPrice', priceMax); else p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => {
    setPriceMin(''); setPriceMax('');
    setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="container products-layout">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            {CATEGORIES.map(cat => (
              <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                <input type="radio" name="category" checked={category === cat}
                  onChange={() => update('category', cat === 'All' ? '' : cat)} />
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            {SORTS.map(s => (
              <label key={s.value} className={`filter-option ${sort === s.value ? 'active' : ''}`}>
                <input type="radio" name="sort" checked={sort === s.value}
                  onChange={() => update('sort', s.value)} />
                {s.label}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range (R)</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={applyPrice}>
              Apply
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="products-main">
          <div className="products-top">
            <div className="results-info">
              {search && <span className="search-tag">Search: "<strong>{search}</strong>"</span>}
              <span className="result-count">{total} product{total !== 1 ? 's' : ''} found</span>
            </div>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid-full">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => update('page', page - 1)}>← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => update('page', p)}>{p}</button>
              ))}
              <button className="page-btn" disabled={page === pages} onClick={() => update('page', page + 1)}>Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
