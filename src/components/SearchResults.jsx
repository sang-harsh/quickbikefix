import React from 'react'
import PropTypes from 'prop-types'
import './SearchResults.css'

export default function SearchResults({ results, query, onClose }) {
  return (
    <dialog
      open
      className="search-results-overlay" 
      aria-modal="true"
      onClose={onClose}
    >
      <div className="search-results-container">
        <div className="search-results-header">
          <h2>Search Results for &quot;{query}&quot;</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close search results">✕</button>
        </div>

        {results && results.length > 0 ? (
          <div className="search-results-grid">
            {results.map((product) => (
              <div key={product.id} className="search-product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="product-badge">{product.type}</div>
                  {product.discount > 0 && (
                    <div className="discount-badge">-{product.discount}%</div>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      <span className="stars">★</span>
                      <span className="rating-value">{product.rating}</span>
                    </div>
                  </div>

                  <p className="product-brand">{product.brand}</p>
                  <p className="product-description">{product.description}</p>

                  <div className="product-specs">
                    <span className="spec-item">
                      <strong>Viscosity:</strong> {product.viscosity}
                    </span>
                    <span className="spec-item">
                      <strong>Volume:</strong> {product.volume}
                    </span>
                  </div>

                  <div className="product-footer">
                    <div className="product-price">
                      <span className="original-price">₹{product.price}</span>
                      <span className="discounted-price">₹{product.discountedPrice}</span>
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No products found</h3>
            <p>Try searching with different keywords like brand name, viscosity, or oil type.</p>
          </div>
        )}
      </div>
    </dialog>
  )
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}
