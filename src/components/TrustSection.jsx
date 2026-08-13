import React from 'react'
import './TrustSection.css'

const STATS = [
  {
    icon: '😊',
    value: '5,000+',
    label: 'Happy Customers',
    sub: 'Across PCMC & Pune',
  },
  {
    icon: '🛡️',
    value: '10 Days',
    label: 'Service Warranty',
    sub: 'On all repairs & work done',
  },
  {
    icon: '🛵',
    value: 'FREE',
    label: 'Pickup & Drop',
    sub: 'Zero-cost doorstep service',
  },
]

export default function TrustSection() {
  return (
    <section className="trust-section">
      <div className="trust-inner">
        <h2 className="trust-title">Why Riders Trust Us</h2>
        <div className="trust-stats">
          {STATS.map((s) => (
            <div key={s.label} className="trust-stat">
              <div className="trust-stat-icon">{s.icon}</div>
              <div className="trust-stat-value">{s.value}</div>
              <div className="trust-stat-label">{s.label}</div>
              <div className="trust-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
