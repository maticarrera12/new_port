import React from "react";
import "./Footer.css";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Side - Contact Information */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <p className="footer-text">mcarreradev12@gmail.com</p>
          <p className="footer-text">+54 1154793056</p>
        </div>

        {/* Center - Call to Action */}
        <div className="footer-section footer-center">
          <h2 className="footer-question">
            Got a project? Want to collaborate?
          </h2>
          <AnimatedButton label="Discuss your project ►" route="/write" />
          </div>

        {/* Right Side - Addresses */}
        <div className="footer-section">
          <div className="address-group">
            <h3 className="footer-heading">Argentina</h3>
            <p className="footer-text">
              Buenos Aires, San Fernando
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p className="footer-copyright">
            © Copyright 2025. mcarreradev. All rights reserved.
          </p>
          <p className="footer-terms">Terms & Conditions.</p>
        </div>
        <div className="footer-bottom-right">
          <div className="social-icons">
            <a href="#" className="social-icon">
              LinkedIn
            </a>
            <a href="#" className="social-icon">
              X
            </a>
            <a href="#" className="social-icon">
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Large Text Element */}
      <div className="footer-large-text">LET&apos;S WORK TOGETHER</div>
    </footer>
  );
};

export default Footer;
