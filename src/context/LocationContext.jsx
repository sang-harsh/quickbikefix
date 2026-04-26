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
    const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { signal: controller.signal }
      )
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed reverse geocoding response')
      }

      const data = await response.json()

      const city = data.address?.city ||
        data.address?.town ||
        data.address?.county ||
        data.address?.state ||
        fallbackLocation

      setLocation(city)
      setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
      setLocationError('')
    } catch {
      setLocation(fallbackLocation)
      setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
      setLocationError('Location detected. Showing coordinates due to address lookup issue.')
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
          setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
          await fetchLocationName(latitude, longitude)
          setIsDetecting(false)
          resolve(true)
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
