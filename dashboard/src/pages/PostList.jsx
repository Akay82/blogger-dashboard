import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User
} from "lucide-react";
//import api from "../api";
import "./PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const response = await api.get("/posts");
//       setPosts(response.data || []);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleDelete = async (id) => {
    // if (window.confirm("Are you sure you want to delete this post?")) {
    //   try {
    //     await api.delete(`/posts/${id}`);
    //     setPosts(posts.filter(post => post.id !== id));
    //   } catch (error) {
    //     console.error("Error deleting post:", error);
    //   }
    // }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <div>
          <h1>Blog Posts</h1>
          <p>Manage all your blog posts in one place</p>
        </div>
        <Link to="/posts/new" className="btn-primary">
          <Plus size={20} />
          <span>New Post</span>
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div className="posts-table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="post-title-cell">
                    <div className="post-thumbnail">
                      {post.image ? (
                        <img src={post.image} alt={post.title} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>
                    <div>
                      <h4>{post.title}</h4>
                      <p className="post-excerpt">
                        {post.content?.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="author-cell">
                    <User size={16} />
                    <span>{post.author || "Admin"}</span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${post.status || 'draft'}`}>
                    {post.status || 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="views-cell">
                    <Eye size={16} />
                    <span>{post.views || 0}</span>
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <Link 
                      to={`/posts/${post.id}`} 
                      className="action-btn view"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </Link>
                    <button 
                      className="action-btn edit"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(post.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No posts found</h3>
          <p>Try changing your search or filter criteria</p>
        </div>
      )}

      {filteredPosts.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;