import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">

        {/* ── Hero Section ── */}
        <div className="hero">
          <div className="hero-eyebrow">🌿 Environmental Portfolio</div>

          <h1 className="hero-title">
            Protecting Nature for <span>Future Generations</span>
          </h1>

          <p className="hero-desc">
            This portfolio showcases a deep passion for environmental advocacy — championing community action, sustainability, and ecological education.
          </p>
          <div className="hero-pills">
            <span className="pill">🌍 Community Action</span>
            <span className="pill">♻️ Sustainability</span>
            <span className="pill">📚 Eco Education</span>
          </div>

          <button className="btn-primary" onClick={() => navigate('/about')}>Explore the Mission ↓</button>
        </div>

        {/* ── Divider ── */}
        <div className="section-divider" />

        {/* ── Why It Matters ── */}
        <h2 className="section-title">Why Environmental Advocacy Matters</h2>

        {/* ── Cards ── */}
        <div className="cards-grid">
          <div className="eco-card">
            <div className="icon">🌱</div>
            <h3>Plant Trees</h3>
            <p>Help restore forests and green our cities. Every sapling planted is a breath of hope.</p>
          </div>

          <div className="eco-card">
            <div className="icon">💧</div>
            <h3>Save Water</h3>
            <p>Freshwater is precious — mindful use today ensures abundance for tomorrow.</p>
          </div>

          <div className="eco-card">
            <div className="icon">♻️</div>
            <h3>Reduce Waste</h3>
            <p>What we throw away today becomes the world our children inherit.</p>
          </div>
        </div>

        <div className="section-divider" />
        <p className="together-text fade-in">
          Together, we can make a <span>difference!</span>
        </p>

        <div className="hero-bottom-img">
          <img src={`${process.env.REACT_APP_BACKEND_URL}/assets/front.jpg`} alt="Environmental impact" />
          <div className="img-overlay" />
          <div className="img-caption">
            <p>"The Earth does not belong to us — we belong to the Earth."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;