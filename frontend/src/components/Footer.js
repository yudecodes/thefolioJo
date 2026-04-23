import React from 'react';

const Footer = ({ setPage }) => (
  <footer>
    <div className="footer-inner">

      <div className="footer-brand">
        <div className="logo">
          <svg style={{ width: 28, height: 28 }} viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2C16 2 4 8 4 20C4 26 9 30 16 30C23 30 28 26 28 20C28 8 16 2 16 2Z"
              fill="#7eab6e"
            />
            <path
              d="M16 7C16 7 7 12 7 20C7 24 11 27 16 27"
              fill="#5a7a52"
            />
            <line
              x1="16" y1="30" x2="16" y2="15"
              stroke="#c8ddd1" strokeWidth="1.8" strokeLinecap="round"
            />
          </svg>
          EcoAdvocate
        </div>
        <p className="footer-tagline">
          Protecting nature and championing sustainable futures for generations to come.
        </p>
      </div>

      <div className="footer-col">
        <h4>Resources</h4>
        <ul>
          <li>UN Environment</li>
          <li>WWF</li>
          <li>Greenpeace</li>
          <li>Earth Day Network</li>
        </ul>
      </div>

    </div>

    <div className="footer-bottom">
      <span>© 2025 EcoAdvocate. All rights reserved.</span>
      <span>Made with 🌿 for the planet</span>
    </div>
  </footer>
);

export default Footer;
