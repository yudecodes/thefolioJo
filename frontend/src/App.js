import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Loader   from './components/Loader';
import Header   from './components/Header';
import Footer   from './components/Footer';

import Home         from './pages/Home';
import About        from './pages/About';
import Contact      from './pages/Contact';
import RegisterPage from './pages/Register';
import LoginPage    from './pages/LoginPage';
import FeedPage     from './pages/FeedPage';
import ProfilePage  from './pages/ProfilePage';
import AdminPage    from './pages/AdminPage';

const App = () => {
  const [loading,    setLoading]    = useState(true);
  const [loaderDone, setLoaderDone] = useState(false);
  const [darkMode,   setDarkMode]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaderDone(true), 2600);
    const t2 = setTimeout(() => setLoading(false),   3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <BrowserRouter>
        {loading && <Loader done={loaderDone} />}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/home"     element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/feed"     element={<FeedPage />} />
          <Route path="/profile"  element={<ProfilePage />} />
          <Route path="/admin"    element={<AdminPage />} />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;