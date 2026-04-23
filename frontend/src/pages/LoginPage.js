import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles.css';

const LoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { setUser } = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });

      // Save token
      localStorage.setItem('token', data.token);

      // ✅ Set user in AuthContext so Header updates immediately
      setUser(data.user);

      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="login-wrap">
        <div className="login-card">

          <h1 className="page-title" style={{ marginBottom: '4px' }}>Welcome Back</h1>
          <p className="page-subtitle">Sign in to access your account and continue your environmental advocacy journey.</p>

          {error && (
            <div className="error-banner">
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '24px', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p className="page-subtitle" style={{ marginBottom: '8px' }}>
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="btn-outline"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                padding: '10px 24px',
                background: 'none',
                border: '1.5px solid var(--sage)',
                color: 'var(--sage)',
                cursor: 'pointer',
              }}
            >
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;