import { createContext, useContext, useMemo, useState } from 'react'

const LocationContext = createContext({
  location: '',
  setLocation: () => {}
})

export function LocationProvider({ children }) {
  const [location, setLocation] = useState('')
  const value = useMemo(() => ({ location, setLocation }), [location])
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
