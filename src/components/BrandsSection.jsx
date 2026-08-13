import React from 'react'
import './BrandsSection.css'

const BRANDS = [
  {
    name: 'Hero',
    abbr: 'H',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" rx="10" fill="none"/>
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="900" fill="#c0392b" fontFamily="Arial, sans-serif">H</text>
        <text x="50%" y="82%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="700" fill="#c0392b" fontFamily="Arial, sans-serif" letterSpacing="2">ERO</text>
      </svg>
    ),
    accent: '#c0392b',
  },
  {
    name: 'Honda',
    abbr: 'H',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18 L12 42 L18 42 L18 32 L28 32 L28 42 L34 42 L34 18 L28 18 L28 28 L18 28 L18 18 Z M36 24 Q36 18 42 18 Q48 18 48 24 L48 36 Q48 42 42 42 Q36 42 36 36 Z M42 23 Q39 23 39 26 L39 34 Q39 37 42 37 Q45 37 45 34 L45 26 Q45 23 42 23 Z" fill="#cc0000"/>
      </svg>
    ),
    accent: '#cc0000',
  },
  {
    name: 'Bajaj',
    abbr: 'B',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="900" fill="#003f8a" fontFamily="Arial, sans-serif">B</text>
        <text x="50%" y="78%" dominantBaseline="middle" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#003f8a" fontFamily="Arial, sans-serif" letterSpacing="1.5">AJAJ</text>
      </svg>
    ),
    accent: '#1565c0',
  },
  {
    name: 'Yamaha',
    abbr: 'Y',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="16" stroke="#0d1b4b" strokeWidth="0" fill="none"/>
        <circle cx="30" cy="30" r="6" fill="#0d1b4b"/>
        <line x1="30" y1="14" x2="30" y2="24" stroke="#0d1b4b" strokeWidth="4" strokeLinecap="round"/>
        <line x1="30" y1="36" x2="16.5" y2="43.8" stroke="#0d1b4b" strokeWidth="4" strokeLinecap="round"/>
        <line x1="30" y1="36" x2="43.5" y2="43.8" stroke="#0d1b4b" strokeWidth="4" strokeLinecap="round"/>
        <text x="50%" y="88%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0d1b4b" fontFamily="Arial, sans-serif" letterSpacing="1">YAMAHA</text>
      </svg>
    ),
    accent: '#3949ab',
  },
  {
    name: 'TVS',
    abbr: 'T',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="#d4002a" fontFamily="Arial, sans-serif" letterSpacing="2">TVS</text>
        <rect x="12" y="40" width="36" height="2.5" rx="1.25" fill="#d4002a"/>
      </svg>
    ),
    accent: '#d4002a',
  },
  {
    name: 'Royal Enfield',
    abbr: 'RE',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="900" fill="#8b7355" fontFamily="Georgia, serif" letterSpacing="0">RE</text>
        <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" fontSize="5.5" fontWeight="600" fill="#8b7355" fontFamily="Georgia, serif" letterSpacing="1.5">ROYAL ENFIELD</text>
      </svg>
    ),
    accent: '#8b7355',
  },
  {
    name: 'Suzuki',
    abbr: 'S',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 22 L30 14 L46 22 L46 26 L30 18 L14 26 Z" fill="#005aaa"/>
        <path d="M14 34 L30 42 L46 34 L46 30 L30 38 L14 30 Z" fill="#005aaa"/>
        <path d="M14 26 L30 34 L46 26" stroke="#005aaa" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    accent: '#005aaa',
  },
  {
    name: 'KTM',
    abbr: 'K',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="24" width="44" height="18" rx="3" fill="#e25100"/>
        <text x="50%" y="35" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif" letterSpacing="3">KTM</text>
      </svg>
    ),
    accent: '#e25100',
  },
  {
    name: 'Kawasaki',
    abbr: 'K',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="900" fill="#009a44" fontFamily="Arial, sans-serif">K</text>
        <text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="700" fill="#009a44" fontFamily="Arial, sans-serif" letterSpacing="1.2">KAWASAKI</text>
      </svg>
    ),
    accent: '#009a44',
  },
  {
    name: 'Jawa',
    abbr: 'J',
    svg: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="900" fill="#8b0000" fontFamily="Georgia, serif" fontStyle="italic">J</text>
        <text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fontWeight="700" fill="#8b0000" fontFamily="Arial, sans-serif" letterSpacing="2">JAWA</text>
      </svg>
    ),
    accent: '#c0392b',
  },
]

export default function BrandsSection() {
  return (
    <section className="brands-section">
      <div className="brands-inner">
        <h2 className="brands-title">Brands We Expertly Service</h2>
        <p className="brands-subtitle">From everyday commuters to performance bikes — we've got you covered</p>
        <div className="brands-grid">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="brand-card"
              style={{ '--brand-accent': brand.accent }}
            >
              <div className="brand-logo-wrap">
                {brand.svg}
              </div>
              <span className="brand-label">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
