// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deletePost, updatePost } from '../api/posts';
import API from '../api/axios';
import '../styles.css';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users,    setUsers]    = useState([]);
  const [posts,    setPosts]    = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab,      setTab]      = useState('users');
  const [loading,  setLoading]  = useState(true);

  // ── Edit state for posts ──
  const [editingPostId,      setEditingPostId]      = useState(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [savingPost,         setSavingPost]         = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') { navigate('/home'); return; }

    const fetchData = async () => {
      try {
        const [usersRes, postsRes, messagesRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/posts'),
          API.get('/contact'),
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  // ── Users ──
  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
    } catch (err) { console.error(err); }
  };

  // ── Posts ──
  const handleRemovePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleStartEdit = (post) => {
    setEditingPostId(post._id);
    setEditingPostContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingPostContent('');
  };

  const handleSaveEdit = async (postId) => {
    if (!editingPostContent.trim()) return;
    setSavingPost(true);
    try {
      const updated = await updatePost(postId, { content: editingPostContent });
      setPosts(prev => prev.map(p => p._id === postId ? updated : p));
      setEditingPostId(null);
      setEditingPostContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPost(false);
    }
  };

  // ── Messages ──
  const handleMarkRead = async (id) => {
    try {
      const { data } = await API.put(`/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? data : m));
    } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) { console.error(err); }
  };

  const getAvatar = (name = '') => name.charAt(0).toUpperCase();
  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) return <div className="page"><div className="feed-loading">Loading dashboard…</div></div>;

  return (
    <div className="page">
      <div className="admin-wrap">

        {/* ── Header ── */}
        <div className="admin-header">
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Admin Dashboard</h1>
          <p className="page-subtitle">Manage members, posts, and contact messages.</p>
        </div>

        {/* ── Stats ── */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <div>
              <div className="admin-stat-number">{users.length}</div>
              <div className="admin-stat-label">Total Members</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">✅</span>
            <div>
              <div className="admin-stat-number">{users.filter(u => u.status === 'active').length}</div>
              <div className="admin-stat-label">Active</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🚫</span>
            <div>
              <div className="admin-stat-number">{users.filter(u => u.status === 'inactive').length}</div>
              <div className="admin-stat-label">Inactive</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">📝</span>
            <div>
              <div className="admin-stat-number">{posts.length}</div>
              <div className="admin-stat-label">Total Posts</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">✉️</span>
            <div>
              <div className="admin-stat-number">{messages.length}</div>
              <div className="admin-stat-label">Messages</div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === 'users'    ? ' active' : ''}`} onClick={() => setTab('users')}>
            👥 Members ({users.length})
          </button>
          <button className={`admin-tab${tab === 'posts'    ? ' active' : ''}`} onClick={() => setTab('posts')}>
            📝 Posts ({posts.length})
          </button>
          <button className={`admin-tab${tab === 'messages' ? ' active' : ''}`} onClick={() => setTab('messages')}>
            ✉️ Messages ({messages.length})
            {unreadCount > 0 && <span className="admin-unread-badge">{unreadCount}</span>}
          </button>
        </div>

        {/* ══ Users Tab ══ */}
        {tab === 'users' && (
          <div className="admin-card">
            {users.length === 0 ? <p className="admin-empty">No members found.</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Member</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-avatar">
                              {u.profilePic
                                ? <img src={`http://localhost:5000/uploads/${u.profilePic}`} alt={u.name} />
                                : <span>{getAvatar(u.name)}</span>}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td className="admin-email">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === 'admin' ? 'admin-badge' : 'member-badge'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                        <td>
                          {u.role !== 'admin' && (
                            <button
                              className={u.status === 'active' ? 'btn-danger-sm' : 'btn-success-sm'}
                              onClick={() => toggleStatus(u._id)}
                            >
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ Posts Tab ══ */}
        {tab === 'posts' && (
          <div className="admin-card">
            {posts.length === 0 ? <p className="admin-empty">No posts yet.</p> : (
              <div className="admin-posts-list">
                {posts.map(p => (
                  <div className="admin-post-row" key={p._id}>
                    <div className="admin-avatar">
                      {p.author?.profilePic
                        ? <img src={`http://localhost:5000/uploads/${p.author.profilePic}`} alt={p.author.name} />
                        : <span>{getAvatar(p.author?.name)}</span>}
                    </div>

                    <div className="admin-post-info">
                      <span className="admin-post-author">{p.author?.name}</span>
                      {p.author?.role === 'admin' && (
                        <span className="role-badge admin-badge" style={{ marginLeft: '6px' }}>Admin</span>
                      )}

                      {/* Inline edit form or content */}
                      {editingPostId === p._id ? (
                        <div className="admin-edit-wrap">
                          <textarea
                            className="post-edit-input"
                            value={editingPostContent}
                            onChange={e => setEditingPostContent(e.target.value)}
                            rows={3}
                          />
                          <div className="post-edit-actions">
                            <button
                              className="btn-success-sm"
                              onClick={() => handleSaveEdit(p._id)}
                              disabled={savingPost || !editingPostContent.trim()}
                            >
                              {savingPost ? 'Saving…' : '✓ Save'}
                            </button>
                            <button className="btn-danger-sm" onClick={handleCancelEdit}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="admin-post-content">{p.content}</p>
                      )}

                      <span className="admin-post-date">
                        {new Date(p.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Edit + Delete buttons */}
                    {editingPostId !== p._id && (
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button className="btn-success-sm" onClick={() => handleStartEdit(p)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-danger-sm" onClick={() => handleRemovePost(p._id)}>
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ Messages Tab ══ */}
        {tab === 'messages' && (
          <div className="admin-card">
            {messages.length === 0 ? <p className="admin-empty">No messages yet.</p> : (
              <div className="admin-messages-list">
                {messages.map(m => (
                  <div key={m._id} className={`admin-message-row${m.read ? '' : ' unread'}`}>
                    {!m.read && <span className="unread-dot" />}
                    <div className="admin-message-info">
                      <div className="admin-message-header">
                        <span className="admin-message-name">{m.name}</span>
                        <span className="admin-message-email">{m.email}</span>
                        <span className="admin-post-date">
                          {new Date(m.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="admin-message-body">{m.message}</p>
                    </div>
                    <div className="admin-message-actions">
                      {!m.read && (
                        <button className="btn-success-sm" onClick={() => handleMarkRead(m._id)}>
                          ✓ Mark Read
                        </button>
                      )}
                      <button className="btn-danger-sm" onClick={() => handleDeleteMessage(m._id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;