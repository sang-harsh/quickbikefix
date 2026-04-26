import React from 'react'
import './Navbar.css'
import LocationOption from './LocationOption'
import SearchBar from './SearchBar'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Location */}
        <div className="navbar-left">
          <LocationOption />
        </div>

        {/* Center - Logo and Brand */}
        <div className="navbar-center">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#aa3bff"></circle>
              <text x="16" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">BIKE</text>
            </svg>
            <h1 className="brand-name">QuickBikeFix</h1>
          </div>
        </div>

        {/* Right side - Empty */}
        <div className="navbar-right">
        </div>

        {/* Search row below logo on mobile */}
        <div className="navbar-search-row">
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}
