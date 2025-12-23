import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Eye, 
  ThumbsUp,
  Share2,
  Bookmark,
  Clock,
  Tag
} from "lucide-react";
//import api from "../api";
import "./PostPreview.css";

const PostPreview = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPost();
//   }, [id]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/posts/${id}`);
//       setPost(response.data);
//     } catch (err) {
//       setError("Failed to fetch post. Please try again.");
//       console.error("Error fetching post:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleDelete = async () => {
    // if (window.confirm("Are you sure you want to delete this post?")) {
    //   try {
    //     await api.delete(`/posts/${id}`);
    //     window.location.href = "/posts";
    //   } catch (err) {
    //     console.error("Error deleting post:", err);
    //   }
    // }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>{error}</h2>
        <Link to="/posts" className="btn-secondary">
          <ArrowLeft size={20} />
          Back to Posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="empty-state">
        <h2>Post not found</h2>
        <Link to="/posts" className="btn-secondary">
          <ArrowLeft size={20} />
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="post-preview">
      <div className="preview-header">
        <Link to="/posts" className="back-btn">
          <ArrowLeft size={20} />
          Back to Posts
        </Link>
        
        <div className="header-actions">
          <button className="btn-secondary">
            <Edit size={18} />
            Edit Post
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="preview-container">
        <div className="post-header">
          <div className="post-meta">
            <span className="status-badge published">{post.status || 'Published'}</span>
            <span className="meta-item">
              <Calendar size={16} />
              {formatDate(post.createdAt)}
            </span>
            <span className="meta-item">
              <Clock size={16} />
              {getReadingTime(post.content)} min read
            </span>
          </div>
          
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta-secondary">
            <span className="meta-item">
              <User size={16} />
              {post.author || 'Admin'}
            </span>
            <div className="tags">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tag">
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {post.image && (
          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className="post-content">
          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="post-footer">
          <div className="engagement-stats">
            <div className="stat">
              <Eye size={20} />
              <span>{post.views || 0} views</span>
            </div>
            <div className="stat">
              <ThumbsUp size={20} />
              <span>{post.likes || 0} likes</span>
            </div>
            <div className="stat">
              <Share2 size={20} />
              <span>{post.shares || 0} shares</span>
            </div>
          </div>

          <div className="footer-actions">
            <button className="action-btn">
              <ThumbsUp size={20} />
              Like
            </button>
            <button className="action-btn">
              <Share2 size={20} />
              Share
            </button>
            <button className="action-btn">
              <Bookmark size={20} />
              Save
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({post.comments?.length || 0})</h3>
          {post.comments?.length > 0 ? (
            <div className="comments-list">
              {post.comments.slice(0, 3).map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-author">{comment.author}</div>
                  <p className="comment-content">{comment.content}</p>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPreview;