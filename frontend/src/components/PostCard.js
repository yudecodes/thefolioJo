// frontend/src/components/PostCard.js
import { useState } from 'react';
import { getComments, addComment, deleteComment, deletePost, updatePost } from '../api/posts';

const PostCard = ({ post, currentUser, onDelete, onUpdate }) => {
  const [showComments, setShowComments]       = useState(false);
  const [comments, setComments]               = useState([]);
  const [commentText, setCommentText]         = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting]           = useState(false);

  // ── Edit state ──
  const [editing, setEditing]       = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving]         = useState(false);

  const isOwner  = currentUser?._id === post.author?._id;
  const isAdmin  = currentUser?.role === 'admin';
  const canDelete = isOwner || isAdmin;
  const canEdit   = isOwner || isAdmin; // owner OR admin can edit

  // ── Comments ──
  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await getComments(post._id);
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(prev => !prev);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await addComment(post._id, commentText);
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Delete post ──
  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(post._id);
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Edit post ──
  const handleEdit = () => {
    setEditContent(post.content);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditContent(post.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const updated = await updatePost(post._id, { content: editContent });
      onUpdate(updated);   // bubble updated post up to parent
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getAvatar = (name = '') => name.charAt(0).toUpperCase();

  return (
    <div className="post-card">

      {/* ── Header ── */}
      <div className="post-header">
        <div className="post-avatar">
          {post.author?.profilePic
            ? <img src={`http://localhost:5000/uploads/${post.author.profilePic}`} alt={post.author.name} />
            : <span>{getAvatar(post.author?.name)}</span>
          }
        </div>
        <div className="post-meta">
          <span className="post-author-name">{post.author?.name}</span>
          {post.author?.role === 'admin' && (
            <span className="role-badge admin-badge">Admin</span>
          )}
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>

        {/* Edit + Delete buttons */}
        <div className="post-actions">
          {canEdit && !editing && (
            <button className="post-edit-btn" onClick={handleEdit} title="Edit post">✏️</button>
          )}
          {canDelete && !editing && (
            <button className="post-delete-btn" onClick={handleDeletePost} title="Delete post">🗑</button>
          )}
        </div>
      </div>

      {/* ── Content (or edit form) ── */}
      {editing ? (
        <div className="post-edit-wrap">
          <textarea
            className="post-edit-input"
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={4}
          />
          <div className="post-edit-actions">
            <button className="btn-success-sm" onClick={handleSaveEdit} disabled={saving || !editContent.trim()}>
              {saving ? 'Saving…' : '✓ Save'}
            </button>
            <button className="btn-danger-sm" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      {/* ── Image ── */}
      {post.image && !editing && (
        <div className="post-image-wrap">
          <img src={`http://localhost:5000/uploads/${post.image}`} alt="Post" className="post-image" />
        </div>
      )}

      {/* ── Footer ── */}
      <div className="post-footer">
        <button className="comment-toggle-btn" onClick={toggleComments}>
          💬 {showComments ? 'Hide' : 'Comments'}
        </button>
      </div>

      {/* ── Comments ── */}
      {showComments && (
        <div className="comments-section">
          {loadingComments && <p className="comments-loading">Loading comments…</p>}
          {comments.length === 0 && !loadingComments && (
            <p className="no-comments">No comments yet. Be the first!</p>
          )}

          {comments.map(c => {
            const canDeleteComment = currentUser?._id === c.author?._id || isAdmin;
            return (
              <div className="comment" key={c._id}>
                <div className="comment-avatar">
                  {c.author?.profilePic
                    ? <img src={`http://localhost:5000/uploads/${c.author.profilePic}`} alt={c.author.name} />
                    : <span>{getAvatar(c.author?.name)}</span>
                  }
                </div>
                <div className="comment-body">
                  <div className="comment-top">
                    <span className="comment-author">{c.author?.name}</span>
                    {c.author?.role === 'admin' && (
                      <span className="role-badge admin-badge">Admin</span>
                    )}
                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
                {canDeleteComment && (
                  <button className="comment-delete-btn" onClick={() => handleDeleteComment(c._id)} title="Delete comment">×</button>
                )}
              </div>
            );
          })}

          <form className="comment-form" onSubmit={handleAddComment}>
            <input
              className="comment-input" type="text"
              placeholder="Write a comment…"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button type="submit" className="comment-submit-btn" disabled={submitting || !commentText.trim()}>
              {submitting ? '…' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;