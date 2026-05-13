import { useState } from 'react'
import PropTypes from 'prop-types'
import './ServicePackages.css'

const WHATSAPP_NUMBER = '919766145714'

const BIKE_OPTIONS = [
  { key: '100cc',       label: '100 CC' },
  { key: '150cc',       label: '150 CC' },
  { key: 'above200cc',  label: 'Above 200 CC' },
  { key: 'sportsBike',  label: 'Sports Bike' },
]

function buildWhatsAppUrl({ pkg, bikeKey, bikeLabel, location, locationLink }) {
  const locationText = location || 'location not detected'
  const fallbackMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
  const finalMapLink = locationLink || fallbackMapLink
  const price = pkg.pricing[bikeKey]
  const message =
    `Hi! I would like to book the *${pkg.name} Package* for my *${bikeLabel}* bike.\n` +
    `Service: ${pkg.tagline}\n` +
    `Price: ₹${price}/-\n` +
    `My Location: ${locationText}\n` +
    `Map Link: ${finalMapLink}\n` +
    `Please confirm my slot. Thank you!`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function PackageCard({ pkg, location, locationLink, permissionStatus, requestLocation, onBookingError }) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => setFlipped((f) => !f)

  const handleBikeSelect = async (bikeKey, bikeLabel) => {
    if (permissionStatus === 'granted' && locationLink) {
      window.open(buildWhatsAppUrl({ pkg, bikeKey, bikeLabel, location, locationLink }), '_blank', 'noopener,noreferrer')
      return
    }

    const hasLocation = await requestLocation()
    if (!hasLocation) {
      onBookingError('Enable location access to continue booking on WhatsApp.')
      return
    }
    window.open(buildWhatsAppUrl({ pkg, bikeKey, bikeLabel, location, locationLink }), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`pkg-flip-card pkg-tier-${pkg.tier}`} aria-label={`${pkg.name} package`}>
      <div className={`pkg-flip-inner${flipped ? ' flipped' : ''}`}>

        {/* ── FRONT ── */}
        <div className="pkg-face pkg-front" onClick={handleFlip} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleFlip() }}>
          <div className="pkg-header">
            <span className="pkg-tier-badge">{pkg.name}</span>
            <span className="pkg-tagline">{pkg.tagline}</span>
          </div>
          <ul className="pkg-features">
            {pkg.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <span className="pkg-tap-hint">Tap to see prices →</span>
        </div>

        {/* ── BACK ── */}
        <div className="pkg-face pkg-back">
          <div className="pkg-back-header">
            <button className="pkg-back-btn" onClick={handleFlip} aria-label="Go back to package details">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <span className="pkg-tier-badge">{pkg.name}</span>
              <p className="pkg-back-subtitle">Choose your bike type</p>
            </div>
          </div>

          <div className="pkg-bike-options">
            {BIKE_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                className="pkg-bike-btn"
                onClick={() => handleBikeSelect(key, label)}
              >
                <span className="pkg-bike-label">{label}</span>
                <span className="pkg-bike-price">₹{pkg.pricing[key]}</span>
                <svg className="pkg-wa-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

PackageCard.propTypes = {
  pkg: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    pricing: PropTypes.objectOf(PropTypes.number).isRequired,
  }).isRequired,
  location: PropTypes.string.isRequired,
  locationLink: PropTypes.string.isRequired,
  permissionStatus: PropTypes.string.isRequired,
  requestLocation: PropTypes.func.isRequired,
  onBookingError: PropTypes.func.isRequired,
}

export default function ServicePackages({ packages, location, locationLink, permissionStatus, requestLocation, onBookingError }) {
  return (
    <div className="service-packages-grid">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          location={location}
          locationLink={locationLink}
          permissionStatus={permissionStatus}
          requestLocation={requestLocation}
          onBookingError={onBookingError}
        />
      ))}
    </div>
  )
}

ServicePackages.propTypes = {
  packages: PropTypes.array.isRequired,
  location: PropTypes.string.isRequired,
  locationLink: PropTypes.string.isRequired,
  permissionStatus: PropTypes.string.isRequired,
  requestLocation: PropTypes.func.isRequired,
  onBookingError: PropTypes.func.isRequired,
}
