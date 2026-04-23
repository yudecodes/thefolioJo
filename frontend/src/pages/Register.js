// RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    birthday:        '',
    password:        '',
    confirmPassword: '',
    gender:          '',
    accountType:     '',
  });

  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const navigate    = useNavigate();
  const { setUser } = useAuth(); // 👈 grab setUser from context

  const handleChange = (e) => {
    const { id, name, value, type } = e.target;
    const key = type === 'radio' ? name : (id || name);
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.birthday)
      e.birthday = 'Birthday is required';
    if (!form.password)
      e.password = 'Password is required';
    else if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    if (!form.gender)
      e.gender = 'Please select a gender';
    if (!form.accountType)
      e.accountType = 'Please select an account type';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name:        form.name,
        email:       form.email,
        birthday:    form.birthday,
        password:    form.password,
        gender:      form.gender,
        accountType: form.accountType,
      });

      // Save token AND update user in context so the header
      // immediately shows the logged-in nav (Feed, Profile, etc.)
      localStorage.setItem('token', data.token);
      setUser(data.user); // 👈 this is the fix

      setSuccess(true);
      setForm({ name: '', email: '', birthday: '', password: '', confirmPassword: '', gender: '', accountType: '' });
      setErrors({});

      setTimeout(() => navigate('/feed'), 1500); // 👈 go to feed, not login
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="register-wrap">
        <div className="register-card">

          <h1 className="page-title" style={{ marginBottom: '4px' }}>Create an Account</h1>
          <p className="page-subtitle">Fill in the form below to join us.</p>

          {apiError && <p className="error-msg" style={{ marginBottom: '12px' }}>{apiError}</p>}

          <form onSubmit={handleSubmit}>
            <div className="register-grid">

              <div className="form-group full">
                <label htmlFor="name">Full Name</label>
                <input className="form-input" type="text" id="name"
                  placeholder="Your name" value={form.name} onChange={handleChange} />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group full">
                <label htmlFor="email">Email</label>
                <input className="form-input" type="email" id="email"
                  placeholder="your@email.com" value={form.email} onChange={handleChange} />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>

              <div className="form-group full">
                <label htmlFor="birthday">Birthday</label>
                <input className="form-input" type="date" id="birthday"
                  value={form.birthday} onChange={handleChange} />
                {errors.birthday && <span className="error-msg">{errors.birthday}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input className="form-input" type="password" id="password"
                  placeholder="••••••" value={form.password} onChange={handleChange} />
                {errors.password && <span className="error-msg">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input className="form-input" type="password" id="confirmPassword"
                  placeholder="••••••" value={form.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group full">
                <label>Gender</label>
                <div className="radio-group">
                  {['Male', 'Female', 'Other'].map(g => (
                    <label className="radio-label" key={g}>
                      <input type="radio" name="gender" value={g}
                        checked={form.gender === g} onChange={handleChange} />
                      {g}
                    </label>
                  ))}
                </div>
                {errors.gender && <span className="error-msg">{errors.gender}</span>}
              </div>

              <div className="form-group full">
                <label htmlFor="accountType">Account Type</label>
                <select className="form-select" id="accountType"
                  value={form.accountType} onChange={handleChange}>
                  <option value="">Select type…</option>
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Admin</option>
                </select>
                {errors.accountType && <span className="error-msg">{errors.accountType}</span>}
              </div>

            </div>

            <button type="submit" className="btn-primary"
              style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Registering…' : 'Register'}
            </button>

            {success && (
              <div className="success-banner">
                ✅ Registration successful! Redirecting…
              </div>
            )}
          </form>

          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;