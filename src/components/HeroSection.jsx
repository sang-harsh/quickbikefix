import React from 'react'
import './HeroSection.css'

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Instant Booking',
    sub: 'Book your slot in under 60 seconds',
  },
  {
    icon: '🛡️',
    title: '10-Day Warranty',
    sub: 'On all repairs & service work',
  },
  {
    icon: '🛵',
    title: 'Free Pickup & Drop',
    sub: 'Across PCMC & Pune city',
  },
]

const AVATARS = ['👨', '👩', '🧔', '👱']

export default function HeroSection() {
  const scrollToBooking = () => {
    document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero-new">
      <div className="hero-new-inner">
        <div className="hero-new-content">
          <h2 className="hero-new-title">
            The Smarter Way to<br />
            <span className="hero-title-accent">Service Your Bike</span>
          </h2>
          <p className="hero-new-desc">
            Professional servicing with Zero-Cost Pickup &amp; Drop.
            <br />
            We come to you — anywhere in PCMC &amp; Pune.
          </p>
          <button className="hero-new-cta" onClick={scrollToBooking}>
            Book a Service
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div className="hero-social-proof">
            <div className="hero-avatars">
              {AVATARS.map((a, i) => (
                <span key={i} className="hero-avatar">{a}</span>
              ))}
            </div>
            <div className="hero-proof-text">
              <span className="hero-stars">★★★★★</span>
              <span className="hero-trust-label">Trusted by <strong>5,000+</strong> Pune Riders</span>
            </div>
          </div>
        </div>

        <div className="hero-benefit-cards">
          {BENEFITS.map((b) => (
            <div key={b.title} className="hero-benefit-card">
              <div className="hero-benefit-icon-wrap">{b.icon}</div>
              <div className="hero-benefit-info">
                <div className="hero-benefit-title">{b.title}</div>
                <div className="hero-benefit-sub">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
