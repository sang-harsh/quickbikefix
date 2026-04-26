import React from 'react'
import './LocationOption.css'
import { useLocationContext } from '../context/LocationContext'

export default function LocationOption() {
  const {
    location,
    permissionStatus,
    isDetecting,
    requestLocation
  } = useLocationContext()

  const handleRefresh = async () => {
    await requestLocation()
  }

  const getDisplayText = () => {
    if (isDetecting) return 'Detecting Location...'
    if (location) return location
    if (permissionStatus === 'denied') return 'No Location'
    if (permissionStatus === 'unsupported') return 'No Location'
    return 'No Location'
  }

  const getButtonTitle = () => {
    if (permissionStatus === 'granted') return 'Refresh location'
    if (permissionStatus === 'denied' || permissionStatus === 'prompt') return 'Allow location access'
    return 'Retry location detection'
  }

  return (
    <button
      type="button"
      className="location-option"
      onClick={handleRefresh}
      title={location || 'No Location'}
      aria-label={getButtonTitle()}
    >
      <svg className="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        <circle cx="12" cy="9" r="2.5"></circle>
      </svg>
      <span className="location-text">{getDisplayText()}</span>
      <span className="location-refresh" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36"></path>
        </svg>
      </span>
    </button>
  )
}
