// frontend/src/pages/FeedPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { getAllPosts, createPost } from '../api/posts';
import PostCard from '../components/PostCard';
import '../styles.css';

const FeedPage = () => {
  const [posts, setPosts]               = useState([]);
  const [currentUser, setCurrentUser]   = useState(null);
  const [search, setSearch]             = useState('');
  const [content, setContent]           = useState('');
  const [image, setImage]               = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading]           = useState(true);
  const [posting, setPosting]           = useState(false);
  const [error, setError]               = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const init = async () => {
      try {
        const [userData, postsData] = await Promise.all([
          API.get('/auth/me').then(r => r.data),
          getAllPosts(),
        ]);
        setCurrentUser(userData);
        setPosts(postsData);
      } catch (err) {
        console.error(err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => { setImage(null); setImagePreview(''); };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true); setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);
      const newPost = await createPost(formData);
      setPosts(prev => [newPost, ...prev]);
      setContent(''); clearImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  // Remove deleted post from state
  const handleDelete = (postId) => setPosts(prev => prev.filter(p => p._id !== postId));

  // Replace updated post in state
  const handleUpdate = (updatedPost) =>
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));

  const filtered = posts.filter(p =>
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page"><div className="feed-loading">Loading feed…</div></div>;

  return (
    <div className="page">
      <div className="feed-wrap">

        <div className="feed-header">
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Community Feed</h1>
          <p className="page-subtitle">
            Share your thoughts on environmental advocacy.
            {currentUser?.role === 'admin' && <span className="admin-label"> You are an Admin.</span>}
          </p>
        </div>

        <div className="feed-search-wrap">
          <input
            className="feed-search" type="text"
            placeholder="🔍  Search posts or authors…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="create-post-card">
          <div className="create-post-top">
            <div className="post-avatar">
              {currentUser?.profilePic
                ? <img src={`http://localhost:5000/uploads/${currentUser.profilePic}`} alt={currentUser.name} />
                : <span>{currentUser?.name?.charAt(0).toUpperCase()}</span>
              }
            </div>
            <form className="create-post-form" onSubmit={handlePost}>
              <textarea
                className="create-post-input"
                placeholder={`What's on your mind, ${currentUser?.name?.split(' ')[0]}?`}
                value={content} onChange={e => setContent(e.target.value)} rows={3}
              />
              {imagePreview && (
                <div className="image-preview-wrap">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button type="button" className="remove-image-btn" onClick={clearImage}>×</button>
                </div>
              )}
              {error && <p className="error-msg">{error}</p>}
              <div className="create-post-actions">
                <label className="attach-btn" title="Attach image">
                  📷
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                <button type="submit" className="btn-primary"
                  disabled={posting || !content.trim()} style={{ padding: '8px 24px' }}>
                  {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="feed-empty">
            {search ? `No posts matching "${search}"` : 'No posts yet. Be the first to post!'}
          </div>
        ) : (
          <div className="posts-list">
            {filtered.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onDelete={handleDelete}
                onUpdate={handleUpdate}  
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FeedPage;