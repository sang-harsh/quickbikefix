import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ServicePackages from './components/ServicePackages'
import './App.css'
import { useLocationContext } from './context/LocationContext'
import PropTypes from 'prop-types'

const WHATSAPP_NUMBER = '919766145714' // Replace with your WhatsApp business number
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

function useOilProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch(`${BASE_URL}oil-data.json`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setError('Failed to load oil products.'))
      .finally(() => setLoading(false))
  }, [])
  return { products, loading, error }
}

function LoadingSpinner() {
  return (
    <div className="data-loading">
      <div className="spinner-ring"></div>
      <p>Loading...</p>
    </div>
  )
}

function DataError({ message }) {
  return <div className="data-error"><p>{message}</p></div>
}

DataError.propTypes = {
  message: PropTypes.string.isRequired
}

function PermissionErrorModal({ message, onClose }) {
  return (
    <dialog
      open
      className="permission-modal-overlay"
      aria-modal="true"
      aria-label="Location permission required"
    >
      <div className="permission-modal">
        <div className="permission-modal-progress">
          <div className="permission-modal-progress-bar"></div>
        </div>
        <h4>Location Access Required</h4>
        <p>{message}</p>
        <p className="permission-modal-note">
          Please allow location access in your browser to continue on WhatsApp.
        </p>
        <button className="permission-modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  )
}

PermissionErrorModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

function getOilIcon(type) {
  if (type === 'Fully Synthetic') return '⚡'
  if (type === 'Semi Synthetic') return '🔧'
  return '🛢️'
}

function FeaturedProducts({ products }) {
  return (
    <div className="products-grid">
      {products.slice(0, 4).map((p) => (
        <div key={p.id} className="product-card">
          <div className="product-image">{getOilIcon(p.type)}</div>
          <h4>{p.name}</h4>
          <p>{p.brand} · {p.viscosity}</p>
          <button className="add-btn">View Details</button>
        </div>
      ))}
    </div>
  )
}

FeaturedProducts.propTypes = {
  products: PropTypes.array.isRequired
}
function App() {
  const [selectedOption, setSelectedOption] = useState('bike-service')
  const [bookingError, setBookingError] = useState('')
  const {
    location,
    locationLink,
    permissionStatus,
    requestLocation
  } = useLocationContext()

  const { packages: servicingPackages, loading: pkgLoading, error: pkgError } = usePackages()
  const { products, loading: oilLoading, error: oilError } = useOilProducts()

  const fullySynthetic = products.filter((p) => p.type === 'Fully Synthetic')
  const semiSynthetic = products.filter((p) => p.type === 'Semi Synthetic')
  const mineral = products.filter((p) => p.type === 'Mineral')

  useEffect(() => {
    if (!bookingError) return undefined

    const timeoutId = setTimeout(() => {
      setBookingError('')
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [bookingError])

  const buildProductWhatsAppUrl = (product) => {
    const locationText = location || 'location not detected'
    const fallbackMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
    const finalMapLink = locationLink || fallbackMapLink
    const message =
      `Hi! I would like to enquire about *${product.name}* (${product.brand}).\n` +
      `Type: ${product.type}\n` +
      `Viscosity: ${product.viscosity}\n` +
      `Volume: ${product.volume}\n` +
      `Offer Price: ₹${product.discountedPrice} (MRP ₹${product.price})\n` +
      `My Location: ${locationText}\n` +
      `Map Link: ${finalMapLink}\n` +
      `Please share availability and booking details. Thank you!`

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  const handleBookProduct = async (event, product) => {
    if (permissionStatus === 'granted' && locationLink) {
      const productUrl = buildProductWhatsAppUrl(product)
      window.open(productUrl, '_blank', 'noopener,noreferrer')
      return
    }

    event.preventDefault()
    const hasLocation = await requestLocation()

    if (!hasLocation) {
      setBookingError('Enable location access to continue product enquiry on WhatsApp.')
      return
    }

    setBookingError('')
    const productUrl = buildProductWhatsAppUrl(product)
    window.open(productUrl, '_blank', 'noopener,noreferrer')
  }

  const renderOilCards = (oilList, isLoading, fetchError) => {
    if (isLoading) return <LoadingSpinner />
    if (fetchError) return <DataError message={fetchError} />
    if (!oilList.length) return <DataError message="No products found." />
    return (
      <div className="option-content-grid oil-grid">
        {oilList.map((oil) => (
          <article
            key={oil.id}
            className="service-card oil-card"
          >
            <div className="oil-card-top">
              <span className="oil-type-badge">{oil.type}</span>
              {oil.discount > 0 && (
                <span className="oil-discount-badge">-{oil.discount}%</span>
              )}
            </div>
            <div className="oil-image-wrap">
              <img
                src={oil.image}
                alt={oil.name}
                className="oil-image"
                loading="lazy"
              />
            </div>
            <h4>{oil.name}</h4>
            <p className="oil-brand">{oil.brand}</p>
            <p className="oil-desc">{oil.description}</p>
            <div className="oil-specs">
              <span><strong>Grade:</strong> {oil.viscosity}</span>
              <span><strong>Vol:</strong> {oil.volume}</span>
              <span><strong>API:</strong> {oil.specs?.api}</span>
            </div>
            <div className="oil-price-row">
              <span className="oil-original-price">₹{oil.price}</span>
              <span className="oil-final-price">₹{oil.discountedPrice}</span>
              <span className="oil-rating">★ {oil.rating}</span>
            </div>
            <button
              type="button"
              className="whatsapp-book-btn oil-whatsapp-btn"
              onClick={(event) => {
                handleBookProduct(event, oil)
              }}
            >
              Enquire on WhatsApp
            </button>
          </article>
        ))}
      </div>
    )
  }

  const renderOptionContent = () => {
    if (selectedOption === 'bike-service') {
      if (pkgLoading) return <LoadingSpinner />
      if (pkgError) return <DataError message={pkgError} />
      return (
        <ServicePackages
          packages={servicingPackages}
          location={location}
          locationLink={locationLink}
          permissionStatus={permissionStatus}
          requestLocation={requestLocation}
          onBookingError={setBookingError}
        />
      )
    }

    if (selectedOption === 'fully-synthetic') {
      return renderOilCards(fullySynthetic, oilLoading, oilError)
    }

    if (selectedOption === 'semi-synthetic') {
      return renderOilCards(semiSynthetic, oilLoading, oilError)
    }

    return renderOilCards(mineral, oilLoading, oilError)
  }

  return (
    <>
      <Navbar />

      <main className="app-content">
        <section className="hero-section">
          <h2>Bike Service & Oil Assistance in PCMC and Pune</h2>
          <p>Share your location and choose the right servicing package for your bike.</p>
          <p className="hero-subtitle">
            Our services are available all over <span className="area-highlight area-tooltip-trigger">PCMC<span className="area-tooltip"><span className="area-tooltip-title">PCMC Areas</span><ul><li>Nigdi</li><li>Akurdi</li><li>Bhosari</li><li>Wakad</li><li>Pimpri</li><li>Chinchwad</li><li>Ravet</li><li>Moshi</li></ul></span></span> and <span className="area-highlight area-tooltip-trigger">Pune City<span className="area-tooltip"><span className="area-tooltip-title">Pune City Areas</span><ul><li>Kalyani Nagar</li><li>Hadapsar</li><li>Katraj</li><li>Warje</li><li>Aundh</li><li>Baner</li><li>Koregaon Park</li><li>Market Yard</li></ul></span></span>.
          </p>
        </section>

        <section className="service-options-section">
          <h3>What are you looking for?</h3>

          <div className="service-options-buttons">
            <button
              className={selectedOption === 'bike-service' ? 'option-btn option-btn-highlight active' : 'option-btn option-btn-highlight'}
              onClick={() => setSelectedOption('bike-service')}
            >
              🔧 Bike Service / Repair
            </button>
            <button
              className={selectedOption === 'fully-synthetic' ? 'option-btn active' : 'option-btn'}
              onClick={() => setSelectedOption('fully-synthetic')}
            >
              Fully Synthetic Oil
            </button>
            <button
              className={selectedOption === 'semi-synthetic' ? 'option-btn active' : 'option-btn'}
              onClick={() => setSelectedOption('semi-synthetic')}
            >
              Semi Synthetic Oil
            </button>
            <button
              className={selectedOption === 'mineral-oil' ? 'option-btn active' : 'option-btn'}
              onClick={() => setSelectedOption('mineral-oil')}
            >
              Mineral Oil
            </button>
          </div>

          <div className="service-options-content">
            {renderOptionContent()}
          </div>
        </section>


      </main>

      <Footer />

      {bookingError ? (
        <PermissionErrorModal
          message={bookingError}
          onClose={() => setBookingError('')}
        />
      ) : null}
    </>
  )
}

export default App
