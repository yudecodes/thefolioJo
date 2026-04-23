import React from 'react';

const Loader = ({ done }) => (
  <div className={`loader-wrap${done ? ' fade-out' : ''}`}>
    <svg className="loader-leaf" viewBox="0 0 64 64" fill="none">
      <path
        d="M32 4C32 4 8 16 8 40C8 52 18 60 32 60C46 60 56 52 56 40C56 16 32 4 32 4Z"
        fill="#7eab6e"
      />
      <path
        d="M32 14C32 14 14 24 14 40C14 48 22 54 32 54"
        fill="#5a7a52"
      />
      <line
        x1="32" y1="60" x2="32" y2="30"
        stroke="#2c4227" strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
    <div className="loader-text">EcoAdvocate</div>
    <div className="loader-bar-track">
      <div className="loader-bar" />
    </div>
  </div>
);

export default Loader;
