import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/react';
import { MessageCircle, Heart, Trash2, Plus, Shield, X, Send, ChevronDown } from 'lucide-react';
import {
  getCommunityPosts, createPost,
  addComment, toggleLike, getPostById,
} from '../services/api';

const CATEGORIES = [
  { value: 'all',            label: 'All Posts',      icon: '📋', color: '#6b6b6b' },
  { value: 'general',        label: 'General',        icon: '💬', color: '#6b7fd4' },
  { value: 'safety-tip',     label: 'Safety Tips',    icon: '🛡️', color: '#2d9e6b' },
  { value: 'incident-alert', label: 'Incident Alert', icon: '⚠️', color: '#e8a020' },
  { value: 'resource',       label: 'Resources',      icon: '📚', color: '#8b5cf6' },
  { value: 'sos-alert',      label: 'SOS Alerts',     icon: '🚨', color: '#dc2626' },
];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CategoryBadge({ category }) {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[1];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 700,
      background: cat.color + '18', color: cat.color,
      border: `1px solid ${cat.color}30`,
    }}>
      {cat.icon} {cat.label}
    </span>
  );
}

function Avatar({ name, avatarUrl, size = 40, bgColor = '#e8a020' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bgColor, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, flexShrink: 0, overflow: 'hidden',
    }}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

function PostCard({ post, currentUserId, onLike, onOpenComments }) {
  const isSos = post.is_sos;
  return (
    <article style={{
      background: isSos ? 'rgba(220,38,38,0.03)' : '#ffffff',
      border: isSos ? '1.5px solid rgba(220,38,38,0.25)' : '1px solid #e8e6e0',
      borderRadius: '16px', padding: '20px 24px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar name={post.author_name} avatarUrl={post.author_avatar} bgColor={isSos ? '#dc2626' : '#e8a020'} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#141414' }}>{post.author_name}</div>
            <div style={{ fontSize: '12px', color: '#6b6b6b' }}>{timeAgo(post.created_at)}</div>
          </div>
        </div>
        <CategoryBadge category={post.category} />
      </div>

      <p style={{ color: '#2d2d2d', lineHeight: 1.65, fontSize: '15px', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
        {post.content}
      </p>

      {isSos && post.sos_lat && (
        <a href={`https://www.google.com/maps?q=${post.sos_lat},${post.sos_lng}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px',
            color: '#dc2626', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none', marginBottom: '16px',
          }}>
          📍 View Emergency Location on Maps
        </a>
      )}

      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f0ede8', paddingTop: '12px' }}>
        <button onClick={() => onLike(post.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#6b6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '4px 8px', borderRadius: '8px' }}>
          <Heart size={14} /> {post.likes_count || 0}
        </button>
        <button onClick={() => onOpenComments(post.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#6b6b6b', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: '4px 8px', borderRadius: '8px' }}>
          <MessageCircle size={14} /> {post.comment_count || 0} Comments
        </button>
      </div>
    </article>
  );
}

function NewPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await onSubmit({ content, category });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="cp-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="cp-modal" style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#141414' }}>Create Community Post</h2>
          <button onClick={onClose} style={{ background: '#f7f6f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b6b6b', marginBottom: '6px' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', background: '#fdf9f3', color: '#141414' }}>
              {CATEGORIES.filter((c) => c.value !== 'all' && c.value !== 'sos-alert').map((c) => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b6b6b', marginBottom: '6px' }}>What do you want to share?</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Share a safety tip, incident report, resource, or anything helpful for our community..."
              rows={5} required
              style={{ width: '100%', padding: '12px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', resize: 'vertical', lineHeight: 1.6, color: '#141414', background: '#fdf9f3' }} />
          </div>
          <button type="submit" disabled={submitting || !content.trim()}
            style={{ width: '100%', padding: '13px', background: '#141414', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CommentsPanel({ postId, currentUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPostById(postId).then(({ comments }) => {
      setComments(comments);
      setLoading(false);
    });
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    const comment = await addComment(postId, {
      clerkUserId:  currentUser.id,
      authorName:   currentUser.fullName || currentUser.firstName || 'User',
      authorAvatar: currentUser.imageUrl,
      content:      newComment.trim(),
    });
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    setSubmitting(false);
  };

  return (
    <div className="cp-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="cp-comments-panel" style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#141414' }}>Comments</h3>
          <button onClick={onClose} style={{ background: '#f7f6f2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {loading && <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>Loading comments...</p>}
          {!loading && comments.length === 0 && (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <Avatar name={c.author_name} avatarUrl={c.author_avatar} size={34} />
              <div style={{ flex: 1, background: '#f7f6f2', borderRadius: '12px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#141414' }}>{c.author_name}</span>
                  <span style={{ fontSize: '11px', color: '#6b6b6b' }}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#2d2d2d', lineHeight: 1.5 }}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        {currentUser && (
          <form onSubmit={handleAddComment}
            style={{ padding: '16px 24px', borderTop: '1px solid #e8e6e0', display: 'flex', gap: '10px' }}>
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e8e6e0', borderRadius: '10px', fontSize: '14px', background: '#fdf9f3', color: '#141414' }} />
            <button type="submit" disabled={submitting || !newComment.trim()}
              style={{ padding: '10px 16px', background: '#141414', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Send size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNewPost, setShowNewPost]       = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const LIMIT = 10;

  const loadPosts = useCallback(async (p = 1, cat = activeCategory) => {
    setLoading(true);
    try {
      const data = await getCommunityPosts(p, LIMIT, cat);
      setPosts((prev) => p === 1 ? data.posts : [...prev, ...data.posts]);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { loadPosts(1, activeCategory); }, [activeCategory]);

  const handleCreatePost = async ({ content, category }) => {
    if (!isSignedIn) return;
    await createPost({
      clerkUserId:  user.id,
      authorName:   user.fullName || user.firstName || 'Anonymous',
      authorAvatar: user.imageUrl,
      content,
      category,
    });
    await loadPosts(1, activeCategory);
  };

  const handleLike = async (postId) => {
    if (!isSignedIn) return;
    await toggleLike(postId, user.id);
    await loadPosts(1, activeCategory);
  };

  const hasMore = posts.length < total;

  return (
    <div className="landing-wrapper">
      <div className="cp-container" style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#fff4e0', borderRadius: '20px', marginBottom: '16px' }}>
            <Shield size={14} color="#e8a020" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e8a020' }}>Safety Community</span>
          </div>
          <h1 className="font-garamond cp-title" style={{ fontSize: '40px', fontWeight: 800, color: '#141414', marginBottom: '12px' }}>
            Community Board
          </h1>
          <p style={{ color: '#6b6b6b', fontSize: '16px', lineHeight: 1.6 }}>
            Share safety tips, incident alerts, and resources. Stay informed. Stay safe. Together.
          </p>
        </div>

        {/* Filters + New Post */}
        <div className="cp-toolbar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="cp-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  border: activeCategory === cat.value ? `1.5px solid ${cat.color}` : '1.5px solid #e8e6e0',
                  background: activeCategory === cat.value ? cat.color + '15' : 'transparent',
                  color: activeCategory === cat.value ? cat.color : '#6b6b6b',
                }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          {isSignedIn && (
            <button onClick={() => setShowNewPost(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: '#141414', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={16} /> New Post
            </button>
          )}
        </div>

        {/* Feed */}
        {loading && page === 1
          ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b6b' }}>Loading community posts...</div>
          : posts.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b6b6b' }}>
                <p>No posts yet in this category.</p>
                {isSignedIn && <p style={{ marginTop: '8px' }}>Be the first to share something helpful!</p>}
              </div>
            : posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={user?.id}
                  onLike={handleLike}
                  onOpenComments={setOpenCommentsPostId} />
              ))
        }

        {hasMore && (
          <button onClick={() => loadPosts(page + 1)} disabled={loading}
            style={{ width: '100%', padding: '13px', background: '#f7f6f2', border: '1.5px solid #e8e6e0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#6b6b6b', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ChevronDown size={16} /> Load More
          </button>
        )}
      </div>

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleCreatePost} />
      )}
      {openCommentsPostId && (
        <CommentsPanel postId={openCommentsPostId} currentUser={user}
          onClose={() => setOpenCommentsPostId(null)} />
      )}
    </div>
  );
}
