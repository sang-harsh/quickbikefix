import React from 'react'
import './AreasSection.css'

const AREAS = {
  PCMC: ['Nigdi', 'Akurdi', 'Bhosari', 'Wakad', 'Pimpri', 'Chinchwad', 'Ravet', 'Moshi'],
  'Pune City': ['Kalyani Nagar', 'Hadapsar', 'Katraj', 'Warje', 'Aundh', 'Baner', 'Koregaon Park', 'Market Yard'],
}

export default function AreasSection() {
  return (
    <section id="areas-section" className="areas-section">
      <div className="areas-inner">
        <div className="areas-header">
          <div className="areas-pin-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#aa3bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h2 className="areas-title">Areas We Serve</h2>
          <p className="areas-subtitle">Free doorstep pickup &amp; drop across PCMC and Pune city</p>
        </div>

        <div className="areas-grid">
          {Object.entries(AREAS).map(([zone, places]) => (
            <div key={zone} className="areas-zone">
              <h3 className="areas-zone-title">{zone}</h3>
              <div className="areas-tags">
                {places.map((place) => (
                  <span key={place} className="areas-tag">{place}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="areas-note">
          Don&apos;t see your area? <strong>WhatsApp us</strong> — we might still be able to help!
        </p>
      </div>
    </section>
  )
}
