import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const LocationContext = createContext({
  location: '',
  setLocation: () => {},
  locationLink: '',
  setLocationLink: () => {},
  permissionStatus: 'prompt',
  isDetecting: false,
  locationError: '',
  requestLocation: async () => false
})

export function LocationProvider({ children }) {
  const [location, setLocation] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const [permissionStatus, setPermissionStatus] = useState('prompt')
  const [isDetecting, setIsDetecting] = useState(false)
  const [locationError, setLocationError] = useState('Location permission not granted')

  const fetchLocationName = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      )
      const data = await response.json()

      const city = data.address?.city ||
        data.address?.town ||
        data.address?.county ||
        data.address?.state ||
        'Location detected'

      setLocation(city)
      setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
      setLocationError('')
      return true
    } catch {
      setLocation('')
      setLocationLink('')
      setLocationError('Unable to resolve your location name. Please try again.')
      return false
    }
  }, [])

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionStatus('unsupported')
      setLocation('')
      setLocationLink('')
      setLocationError('Geolocation is not supported on this browser')
      return false
    }

    setIsDetecting(true)

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setPermissionStatus('granted')
          const { latitude, longitude } = position.coords
          const isResolved = await fetchLocationName(latitude, longitude)
          setIsDetecting(false)
          resolve(isResolved)
        },
        (error) => {
          if (error.code === 1) {
            setPermissionStatus('denied')
            setLocationError('Location permission denied. Please allow location access.')
          } else {
            setLocationError('Unable to fetch your location. Please try again.')
          }
          setLocation('')
          setLocationLink('')
          setIsDetecting(false)
          resolve(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }, [fetchLocationName])

  useEffect(() => {
    let mounted = true

    const initLocation = async () => {
      if (!navigator.geolocation) {
        if (!mounted) return
        setPermissionStatus('unsupported')
        setLocationError('Geolocation is not supported on this browser')
        return
      }

      if (!navigator.permissions?.query) {
        await requestLocation()
        return
      }

      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (!mounted) return

        setPermissionStatus(permission.state)

        if (permission.state === 'granted') {
          await requestLocation()
        } else if (permission.state === 'denied') {
          setLocationError('Location permission denied. Please allow location access.')
        } else {
          setLocationError('Location permission not granted')
        }
      } catch {
        await requestLocation()
      }
    }

    initLocation()

    return () => {
      mounted = false
    }
  }, [requestLocation])

  const value = useMemo(
    () => ({
      location,
      setLocation,
      locationLink,
      setLocationLink,
      permissionStatus,
      isDetecting,
      locationError,
      requestLocation
    }),
    [location, locationLink, permissionStatus, isDetecting, locationError, requestLocation]
  )

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export function useLocationContext() {
  return useContext(LocationContext)
}
