import { createContext, useContext, useMemo, useState } from 'react'

const LocationContext = createContext({
  location: '',
  setLocation: () => {},
  locationLink: '',
  setLocationLink: () => {}
})

export function LocationProvider({ children }) {
  const [location, setLocation] = useState('')
  const [locationLink, setLocationLink] = useState('')
  const value = useMemo(
    () => ({ location, setLocation, locationLink, setLocationLink }),
    [location, locationLink]
  )
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

LocationProvider.propTypes = {
  children: () => null
}

export function useLocationContext() {
  return useContext(LocationContext)
}
