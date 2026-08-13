import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocationContext } from '../context/LocationContext'
import './BookingSection.css'

const WHATSAPP_NUMBER = '919766145714'

const BIKE_OPTIONS = [
  { key: '100cc',      label: '100 CC' },
  { key: '150cc',      label: '150 CC' },
  { key: 'above200cc', label: 'Above 200 CC' },
  { key: 'sportsBike', label: 'Sports Bike' },
]

const TIER_STYLES = {
  silver: {
    tabBg: 'linear-gradient(135deg, #c8cdd6, #8d96a3)',
    detailsBg: 'rgba(160, 170, 180, 0.06)',
    detailsBorder: 'rgba(180, 190, 200, 0.22)',
    checkColor: '#a8b8c8',
    accent: '#a8b8c8',
    accentBg: 'rgba(168, 184, 200, 0.14)',
  },
  gold: {
    tabBg: 'linear-gradient(135deg, #fbbf24, #d97706)',
    detailsBg: 'rgba(251, 191, 36, 0.06)',
    detailsBorder: 'rgba(251, 191, 36, 0.22)',
    checkColor: '#fbbf24',
    accent: '#fbbf24',
    accentBg: 'rgba(251, 191, 36, 0.13)',
  },
  platinum: {
    tabBg: 'linear-gradient(135deg, #d0e4f7, #7aaed6)',
    detailsBg: 'rgba(122, 174, 214, 0.07)',
    detailsBorder: 'rgba(122, 174, 214, 0.24)',
    checkColor: '#8fc4e8',
    accent: '#8fc4e8',
    accentBg: 'rgba(143, 196, 232, 0.13)',
  },
}

function buildWhatsAppUrl({ pkg, bikeKey, bikeLabel, address, locationLink, usingGPS }) {
  const locationText = address || 'location not provided'
  const fallbackMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
  const finalMapLink = usingGPS ? (locationLink || fallbackMapLink) : fallbackMapLink
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

export default function BookingSection({ packages, loading }) {
  const [activePkgId, setActivePkgId] = useState(null)
  const [activeBike, setActiveBike] = useState(null)
  const [address, setAddress] = useState('')
  const [usingGPS, setUsingGPS] = useState(false)
  const [gpsError, setGpsError] = useState('')

  const {
    location,
    locationLink,
    isDetecting,
    requestLocation,
    permissionStatus,
  } = useLocationContext()

  useEffect(() => {
    if (usingGPS && location) {
      setAddress(location)
    }
  }, [usingGPS, location])

  const activePkg = packages.find((p) => p.id === activePkgId) || null

  const handleSelectPkg = (id) => {
    setActivePkgId((prev) => (prev === id ? null : id))
    setActiveBike(null)
  }

  const handleGPS = async () => {
    setGpsError('')
    if (permissionStatus === 'granted' && location) {
      setUsingGPS(true)
      setAddress(location)
      return
    }
    const ok = await requestLocation()
    if (ok) {
      setUsingGPS(true)
    } else {
      setGpsError('Could not detect location. Please type your address below.')
    }
  }

  const handleAddressChange = (e) => {
    setAddress(e.target.value)
    setUsingGPS(false)
  }

  const handleBook = () => {
    if (!activePkg || !activeBike || !address.trim()) return
    const bikeLabel = BIKE_OPTIONS.find((b) => b.key === activeBike)?.label || activeBike
    const url = buildWhatsAppUrl({
      pkg: activePkg,
      bikeKey: activeBike,
      bikeLabel,
      address: address.trim(),
      locationLink,
      usingGPS,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const canBook = activePkg && activeBike && address.trim().length > 0

  return (
    <section id="book-now" className="booking-section">
      <div className="booking-inner">
        <div className="booking-header">
          <h2 className="booking-title">Book Now</h2>
          <p className="booking-subtitle">Choose your package, select your bike type, and confirm your address.</p>
        </div>

        {/* Package list with inline details */}
        <div className="booking-pkg-list">
          {loading ? (
            <div className="booking-loading">Loading packages…</div>
          ) : (
            packages.map((pkg) => {
              const ts = TIER_STYLES[pkg.tier] || TIER_STYLES.silver
              const isActive = activePkgId === pkg.id

              return (
                <div key={pkg.id} className="booking-pkg-item">
                  <button
                    className={`booking-pkg-tab booking-pkg-tab--${pkg.tier}${isActive ? ' active' : ''}`}
                    style={{ '--tier-bg': ts.tabBg, '--tier-accent': ts.accent }}
                    onClick={() => handleSelectPkg(pkg.id)}
                    aria-expanded={isActive}
                  >
                    <div className="bpt-tier-dot" style={{ background: ts.tabBg }} />
                    <span className="bpt-name">{pkg.name}</span>
                    <span className="bpt-arrow">{isActive ? '▲' : '▼'}</span>
                  </button>

                  {isActive && (
                    <div
                      className="booking-pkg-details"
                      style={{
                        '--details-bg': ts.detailsBg,
                        '--details-border': ts.detailsBorder,
                        '--check-color': ts.checkColor,
                      }}
                    >
                      <div className="booking-features">
                        <h4 className="booking-features-title">What&apos;s included</h4>
                        <ul className="booking-features-list">
                          {pkg.features.map((f) => (
                            <li key={f}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--check-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="booking-bike-select">
                        <h4 className="booking-bike-title">Select your bike type</h4>
                        <div className="booking-bike-options">
                          {BIKE_OPTIONS.map(({ key, label }) => (
                            <button
                              key={key}
                              className={`booking-bike-btn${activeBike === key ? ' active' : ''}`}
                              style={{ '--bike-accent': ts.accent, '--bike-accent-bg': ts.accentBg }}
                              onClick={() => setActiveBike(key)}
                            >
                              <span className="bbb-label">{label}</span>
                              <span className="bbb-price" style={{ color: activeBike === key ? '#fff' : ts.accent }}>₹{pkg.pricing[key]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Address + Book */}
        <div className="booking-address-section">
          <h4 className="booking-address-title">Your address</h4>
          <div className="booking-address-row">
            <button
              className={`booking-gps-btn${usingGPS ? ' gps-active' : ''}`}
              onClick={handleGPS}
              disabled={isDetecting}
              type="button"
            >
              {isDetecting ? (
                <span className="gps-spinner" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
              )}
              {isDetecting ? 'Detecting…' : usingGPS ? 'Location set' : 'Use GPS'}
            </button>
            <span className="booking-or">or</span>
            <input
              className="booking-address-input"
              type="text"
              placeholder="Type your address or area…"
              value={address}
              onChange={handleAddressChange}
            />
          </div>
          {gpsError && <p className="booking-gps-error">{gpsError}</p>}
        </div>

        <button
          className="booking-whatsapp-btn"
          onClick={handleBook}
          disabled={!canBook}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Book on WhatsApp
        </button>

        {!canBook && activePkg && (
          <p className="booking-hint">
            {!activeBike ? 'Select a bike type above' : !address.trim() ? 'Enter your address to continue' : ''}
          </p>
        )}
      </div>
    </section>
  )
}

BookingSection.propTypes = {
  packages: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}
