import React, { useState, useEffect, useRef } from 'react'
import './LocationOption.css'
import { useLocationContext } from '../context/LocationContext'

const DEFAULT_LOCATION = {
  name: 'Gajanan Enterprises',
  latitude: 18.5938048337629,
  longitude: 73.81910990000002
}

export default function LocationOption() {
  const [location, setLocation] = useState('Detecting Location...')
  const [loading, setLoading] = useState(true)
  const { setLocation: setGlobalLocation, setLocationLink } = useLocationContext()
  const timeoutRef = useRef(null)

  useEffect(() => {
    getDeviceLocation()
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const setDefaultLocation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setLocation(DEFAULT_LOCATION.name)
    setGlobalLocation(DEFAULT_LOCATION.name)
    setLocationLink(`https://www.google.com/maps?q=${DEFAULT_LOCATION.latitude},${DEFAULT_LOCATION.longitude}`)
    setLoading(false)
  }

  const getDeviceLocation = () => {
    // Set timeout to fallback to default location after 8 seconds
    timeoutRef.current = setTimeout(() => {
      console.log('Location detection timeout - using default location')
      setDefaultLocation()
    }, 8000)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Clear timeout on successful position retrieval
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          const { latitude, longitude } = position.coords
          await fetchLocationName(latitude, longitude)
        },
        (error) => {
          // Clear timeout on error
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          
          console.log('Geolocation error:', error.code, error.message)
          // PERMISSION_DENIED (1), POSITION_UNAVAILABLE (2), TIMEOUT (3)
          // Use default location for all error cases
          setDefaultLocation()
        },
        {
          enableHighAccuracy: false,
          timeout: 7000,  // 7 second timeout for geolocation
          maximumAge: 0
        }
      )
    } else {
      // Geolocation not supported, use default
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setDefaultLocation()
    }
  }

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { signal: AbortSignal.timeout(5000) }
      )
      const data = await response.json()
      
      // Extract city or town name
      const city = data.address?.city || 
                  data.address?.town || 
                  data.address?.county ||
                  data.address?.state ||
                  'Location detected'
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setLocation(city)
      setGlobalLocation(city)
      setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
      setLoading(false)
    } catch (error) {
      console.error('Error getting location name:', error)
      // Use default location on error
      setDefaultLocation()
    }
  }

  const handleRefresh = () => {
    setLocation('Detecting Location...')
    setLoading(true)
    getDeviceLocation()
  }

  return (
    <div className="location-option">
      <svg className="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        <circle cx="12" cy="9" r="2.5"></circle>
      </svg>
      <span className="location-text">{location}</span>
      {!loading && (
        <button className="location-refresh" onClick={handleRefresh} title="Refresh location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36"></path>
          </svg>
        </button>
      )}
    </div>
  )
}
