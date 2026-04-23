// frontend/src/pages/ProfilePage.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name,   setName]   = useState(user?.name || '');
  const [bio,    setBio]    = useState(user?.bio  || '');
  const [pic,    setPic]    = useState(null);
  const [preview, setPreview] = useState('');
  const [curPw,  setCurPw]  = useState('');
  const [newPw,  setNewPw]  = useState('');
  const [msg,    setMsg]    = useState({ text: '', type: '' });
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const picSrc = preview
    || (user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null);

  const getAvatar = (name = '') => name.charAt(0).toUpperCase();

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setSavingProfile(true);

    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg({ text: '✅ Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setSavingPassword(true);

    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setMsg({ text: '✅ Password changed successfully!', type: 'success' });
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to change password.', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="page">
      <div className="profile-wrap">

        {/* ── Profile Hero ── */}
        <div className="profile-hero">
          <div className="profile-avatar-lg">
            {picSrc
              ? <img src={picSrc} alt={user?.name} />
              : <span>{getAvatar(user?.name)}</span>
            }
          </div>
          <div className="profile-hero-info">
            <h1 className="page-title" style={{ marginBottom: '4px' }}>{user?.name}</h1>
            <p className="page-subtitle">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="role-badge admin-badge" style={{ marginTop: '6px', display: 'inline-block' }}>
                Admin
              </span>
            )}
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
          </div>
        </div>

        {/* ── Message Banner ── */}
        {msg.text && (
          <div className={msg.type === 'success' ? 'success-banner' : 'error-banner'}>
            {msg.text}
          </div>
        )}

        <div className="profile-grid">

          {/* ── Edit Profile ── */}
          <div className="profile-card">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">👤</span> Edit Profile
            </h2>

            <form onSubmit={handleProfile}>

              {/* Avatar upload */}
              <div className="avatar-upload-wrap">
                <div className="avatar-upload-preview">
                  {picSrc
                    ? <img src={picSrc} alt="Preview" />
                    : <span>{getAvatar(user?.name)}</span>
                  }
                </div>
                <label className="avatar-upload-btn">
                  📷 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePicChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="profileName">Display Name</label>
                <input
                  className="form-input"
                  id="profileName"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profileBio">Bio</label>
                <textarea
                  className="form-input"
                  id="profileBio"
                  placeholder="Write a short bio…"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={savingProfile}
              >
                {savingProfile ? 'Saving…' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* ── Change Password ── */}
          <div className="profile-card">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">🔒</span> Change Password
            </h2>

            <form onSubmit={handlePassword}>
              <div className="form-group">
                <label htmlFor="curPw">Current Password</label>
                <input
                  className="form-input"
                  id="curPw"
                  type="password"
                  placeholder="••••••"
                  value={curPw}
                  onChange={(e) => setCurPw(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPw">New Password</label>
                <input
                  className="form-input"
                  id="newPw"
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={savingPassword}
              >
                {savingPassword ? 'Updating…' : 'Change Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;