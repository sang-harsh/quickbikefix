import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>QuickBikeFix helps riders book trusted bike servicing and find the right engine oil options across Pune City and PCMC.</p>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <strong>Address:</strong><br />
              123 Automotive Street<br />
              Motor City, MC 45678
            </p>
            <p>
              <strong>Phone:</strong><br />
              +1 (555) 123-4567
            </p>
            <p>
              <strong>Email:</strong><br />
              support@quickbikefix.com
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#facebook" aria-label="Facebook">Facebook</a>
            <a href="#twitter" aria-label="Twitter">Twitter</a>
            <a href="#instagram" aria-label="Instagram">Instagram</a>
            <a href="#linkedin" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 QuickBikeFix. All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <span>|</span>
          <a href="#terms">Terms & Conditions</a>
          <span>|</span>
          <a href="#shipping">Shipping Policy</a>
        </div>
      </div>
    </footer>
  )
}
