import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import JourneySection from './components/JourneySection'
import BookingSection from './components/BookingSection'
import BrandsSection from './components/BrandsSection'
import AreasSection from './components/AreasSection'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import './App.css'
import PropTypes from 'prop-types'

const BASE_URL = import.meta.env.BASE_URL

function usePackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch(`${BASE_URL}packages-data.json`)
      .then((r) => r.json())
      .then((data) => setPackages(data.packages || []))
      .catch(() => setError('Failed to load service packages.'))
      .finally(() => setLoading(false))
  }, [])
  return { packages, loading, error }
}

function DataError({ message }) {
  return <div className="data-error"><p>{message}</p></div>
}

DataError.propTypes = {
  message: PropTypes.string.isRequired,
}

function App() {
  const { packages, loading, error } = usePackages()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {error ? (
          <DataError message={error} />
        ) : (
          <BookingSection packages={packages} loading={loading} />
        )}
        <JourneySection />
        <BrandsSection />
        <AreasSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}

export default App
