// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import API from '../api/axios';
import '../styles.css';

const Contact = () => {
  const [formData, setFormData]       = useState({ name: '', email: '', message: '' });
  const [errors, setErrors]           = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                  e.email   = 'Valid email is required';
    if (!formData.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      // POST to backend — saved to MongoDB
      await API.post('/contact', formData);
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* Page Header */}
        <h1 className="page-title">Get in Touch</h1>
        <p className="page-subtitle">
          Have questions or want to collaborate on environmental advocacy?
          We'd love to hear from you!
        </p>

        {/* Form + Info Grid */}
        <div className="contact-grid">
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: '20px' }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text" id="name" className="form-input"
                  placeholder="Your full name"
                  value={formData.name} onChange={handleChange}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email" id="email" className="form-input"
                  placeholder="your@email.com"
                  value={formData.email} onChange={handleChange}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message" className="form-textarea"
                  placeholder="Write your message here..."
                  value={formData.message} onChange={handleChange}
                />
                {errors.message && <span className="error-msg">{errors.message}</span>}
              </div>

              <button
                type="submit" className="btn-primary"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send Message →'}
              </button>

              {showSuccess && (
                <div className="success-banner">
                  ✅ Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>

          <div className="info-col">
            <div className="info-card">
              <h4>📧 Email Us</h4>
              <p>joelahnferrer20@gmail.com</p>
            </div>
            <div className="info-card">
              <h4>📍 Our Location</h4>
              <p>Bauang, La Union, Philippines</p>
            </div>
            <div className="info-card">
              <h4>💬 Connect With Us</h4>
              <p>Follow us on social media for environmental updates and advocacy tips!</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <h2 className="section-title">Our Location</h2>
        <div className="map-wrapper" style={{ marginBottom: '40px' }}>
          <iframe
            title="Bauang La Union Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=120.2900,16.5000,120.3400,16.5500&layer=mapnik&marker=16.5250,120.3150"
            allowFullScreen
          />
        </div>

        <div className="section-divider" />

        {/* Resources Table */}
        <h2 className="section-title">Environmental Resources</h2>
        <p className="page-subtitle" style={{ marginBottom: '16px' }}>
          Learn more from these trusted organizations.
        </p>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="resources-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Focus Area</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>🌍 UN Environment</td><td>Global environmental initiatives and climate action</td></tr>
              <tr><td>🦁 World Wildlife Fund (WWF)</td><td>Wildlife conservation and habitat protection</td></tr>
              <tr><td>🌿 Greenpeace</td><td>Environmental campaigns and ocean protection</td></tr>
              <tr><td>♻️ Earth Day Network</td><td>Environmental education and sustainability</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Contact;