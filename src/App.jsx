import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

  const buildWhatsAppUrl = (pkg) => {
    const locationText = location || 'location not detected'
    const fallbackMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
    const finalMapLink = locationLink || fallbackMapLink
    const message =
      `Hi! I would like to book the *${pkg.name} Bike Service Package* at ₹${pkg.price}/-.\n` +
      `Includes: ${pkg.oil}\n` +
      `My Location: ${locationText}\n` +
      `Map Link: ${finalMapLink}\n` +
      `Please confirm my slot. Thank you!`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

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

  const handleBookPackage = async (event, pkg) => {
    if (permissionStatus === 'granted' && locationLink) {
      setBookingError('')
      return
    }

    event.preventDefault()
    const hasLocation = await requestLocation()

    if (!hasLocation) {
      setBookingError('Unable to continue booking because location permission is not enabled.')
      return
    }

    setBookingError('')
    const bookingUrl = buildWhatsAppUrl(pkg)
    window.open(bookingUrl, '_blank', 'noopener,noreferrer')
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
        <div className="option-content-grid packages-grid">
          {servicingPackages.map((pkg) => (
            <article key={pkg.id} className="service-card package-card">
              <div className="package-head">
                <h4>{pkg.name}</h4>
                <p className="package-price">{pkg.price}</p>
              </div>
              <p className="package-oil"><strong>Oil Included:</strong> {pkg.oil}</p>
              <ul className="package-features">
                {pkg.features.map((feature) => (
                  <li key={`${pkg.id}-${feature}`}>{feature}</li>
                ))}
              </ul>
              <a
                className="whatsapp-book-btn"
                href={buildWhatsAppUrl(pkg)}
                onClick={(event) => {
                  handleBookPackage(event, pkg)
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Book on WhatsApp
              </a>
            </article>
          ))}
        </div>
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
              className={selectedOption === 'bike-service' ? 'option-btn active' : 'option-btn'}
              onClick={() => setSelectedOption('bike-service')}
            >
              Bike Service / Repair
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
