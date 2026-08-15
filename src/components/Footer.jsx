import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <strong>Address:</strong>
              Gajanan Enterprises,<br />
              Near Pimple Gurav Bus Stop,<br />
              Pune - 411061, Maharashtra, India
            </p>
            <p>
              <strong>Phone:</strong>
              +91 8080654717<br/>
              +91 8830252696
            </p>
            <p>
              <strong>Email:</strong>
              gajananaenterprises0656@gmail.com
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
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/share/1EhmScoEM8/" aria-label="Facebook">Facebook</a>
            <a href="https://www.instagram.com/quickbikefix?igsh=MXd1ODFubWJoZ2hhaA==&igsi=MXd1ODFubWJoZ2hhaA==" aria-label="Instagram">Instagram</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>About Us</h3>
          <p>QuickBikeFix helps riders book trusted bike servicing and find the right engine oil options across Pune City and PCMC.</p>
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
