import React, { useState } from 'react'
import './SearchBar.css'
import SearchResults from './SearchResults'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setShowResults(false)
      return
    }

    setIsLoading(true)
    
    try {
      // Fetch data from the JSON file
      const response = await fetch('/oil-data.json')
      const data = await response.json()
      
      // Search through products
      const query = searchQuery.toLowerCase()
      const results = data.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        product.viscosity.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
      
      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Error fetching products:', error)
      setSearchResults([])
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseResults = () => {
    setShowResults(false)
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for oil brands, types..."
          value={searchQuery}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={isLoading}>
          {isLoading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          )}
        </button>
      </form>
      
      {showResults && (
        <SearchResults 
          results={searchResults} 
          query={searchQuery}
          onClose={handleCloseResults}
        />
      )}
    </>
  )
}
