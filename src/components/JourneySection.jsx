import React from 'react'
import './JourneySection.css'

const STEPS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    label: 'Book Online',
    desc: 'Choose your plan & slot in under 60 seconds',
    scrollTarget: 'book-now',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
        <rect x="9" y="11" width="14" height="10" rx="1"/>
        <circle cx="12" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
      </svg>
    ),
    label: 'We Pickup',
    desc: 'Our team collects your bike from your doorstep',
    scrollTarget: 'areas-section',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    label: 'Expert Service',
    desc: 'Certified mechanics service your bike with care',
    scrollTarget: 'brands-section',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
      </svg>
    ),
    label: 'Free Delivery',
    desc: 'Bike dropped back, fresh and ready to ride',
    scrollTarget: 'areas-section',
  },
]

export default function JourneySection() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="journey-section">
      <div className="journey-inner">
        <h2 className="journey-title">Your Journey with Us</h2>
        <p className="journey-subtitle">Simple, hassle-free bike service in 4 easy steps</p>

        <div className="journey-steps">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.label}>
              <div
                className={`journey-step${step.scrollTarget ? ' journey-step--clickable' : ''}`}
                onClick={step.scrollTarget ? () => scrollTo(step.scrollTarget) : undefined}
                role={step.scrollTarget ? 'button' : undefined}
                tabIndex={step.scrollTarget ? 0 : undefined}
                onKeyDown={step.scrollTarget ? (e) => { if (e.key === 'Enter') scrollTo(step.scrollTarget) } : undefined}
              >
                <div className="journey-step-num">{index + 1}</div>
                <div className="journey-step-icon">{step.icon}</div>
                <div className="journey-step-label">{step.label}</div>
                <div className="journey-step-desc">{step.desc}</div>
              </div>
              {index < STEPS.length - 1 && (
                <div className="journey-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
