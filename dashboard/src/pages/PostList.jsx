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
  FileText,
} from "lucide-react";
import api from "../api/axios";
import "./PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await api.get(
        `/posts?page=${page}&limit=${postsPerPage}`
      );
      setPosts(response.data.data || []);
      setTotalPosts(response.data.pagination?.total || 0);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/posts/${id}`);
        fetchPosts(currentPage);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "generated":
        return "pl-status-published";
      case "draft":
        return "pl-status-draft";
      case "published":
        return "pl-status-published";
      case "scheduled":
        return "pl-status-scheduled";
      default:
        return "pl-status-draft";
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "generated":
        return "Generated";
      case "draft":
        return "Draft";
      case "published":
        return "Published";
      case "scheduled":
        return "Scheduled";
      default:
        return "Draft";
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="pl-loading">
        <div className="pl-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="pl-container">
      <div className="pl-header">
        <div className="pl-header-content">
          <h1 className="pl-title">Blog Posts</h1>
          <p className="pl-subtitle">Manage all your blog posts in one place</p>
          <p className="pl-total-count">Total Posts: {totalPosts}</p>
        </div>
        <Link to="/posts/new" className="pl-new-post-btn">
          <Plus size={20} />
          <span>New Post</span>
        </Link>
      </div>

      <div className="pl-filters">
        <div className="pl-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search posts by title, content, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-search-input"
          />
        </div>

        <div className="pl-filter-group">
          <Filter size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-filter-select"
          >
            <option value="all">All Status</option>
            <option value="generated">Generated</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="pl-desktop-view">
        <div className="pl-table-container">
          <table className="pl-table">
            <thead>
              <tr>
                <th className="pl-th-title">Title/Topic</th>
                <th className="pl-th-provider">AI Provider</th>
                <th className="pl-th-date">Created Date</th>
                <th className="pl-th-status">Status</th>
                <th className="pl-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post._id} className="pl-table-row">
                    <td className="pl-td-title">
                      <div className="pl-post-cell">
                        <div className="pl-post-thumbnail">
                          {post.images &&
                          post.images.length > 0 &&
                          post.images[0].url ? (
                            <img
                              src={post.images[0].url}
                              alt={post.images[0].alt || post.title}
                              className="pl-thumbnail-img"
                            />
                          ) : (
                            <FileText size={20} className="pl-thumbnail-icon" />
                          )}
                        </div>
                        <div className="pl-post-info">
                          <h4 className="pl-post-title">
                            {post.title || post.topic}
                          </h4>
                          <p className="pl-post-slug">/{post.slug}</p>
                          {post.topic && post.topic !== post.title && (
                            <p className="pl-post-topic">
                              <small>Topic: {post.topic}</small>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="pl-td-provider">
                      <div className="pl-provider-cell">
                        <span
                          className={`pl-provider-badge ${
                            post.aiProvider || "unknown"
                          }`}
                        >
                          {post.aiProvider || "Unknown"}
                        </span>
                        {post.modelUsed && (
                          <small className="pl-model-used">
                            {post.modelUsed}
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="pl-td-date">
                      <div className="pl-date-cell">
                        <Calendar size={16} className="pl-date-icon" />
                        <div className="pl-date-info">
                          <span className="pl-date-text">
                            {formatDate(post.createdAt)}
                          </span>
                          {post.updatedAt &&
                            post.updatedAt !== post.createdAt && (
                              <small className="pl-updated-text">Updated</small>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="pl-td-status">
                      <span
                        className={`pl-status-badge ${getStatusBadgeClass(
                          post.status
                        )}`}
                      >
                        {getStatusDisplayText(post.status)}
                      </span>
                    </td>
                    <td className="pl-td-actions">
                      <div className="pl-actions-cell">
                        <a
                          href={post.blogger?.postUrl}
                          className="pl-action-btn pl-view-btn"
                          title="Preview"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye size={16} />
                        </a>
                        <Link
                          to={`/posts/edit/${post._id}`}
                          className="pl-action-btn pl-edit-btn"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          className="pl-action-btn pl-delete-btn"
                          onClick={() => handleDelete(post._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="pl-no-results">
                    <div className="pl-empty-state">
                      <FileText size={48} className="pl-empty-icon" />
                      <h4 className="pl-empty-title">No posts found</h4>
                      <p className="pl-empty-text">
                        Try changing your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="pl-mobile-view">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post._id} className="pl-mobile-card">
              <div className="pl-card-header">
                <div className="pl-card-thumbnail">
                  {post.images &&
                  post.images.length > 0 &&
                  post.images[0].url ? (
                    <img
                      src={post.images[0].url}
                      alt={post.images[0].alt || post.title}
                      className="pl-card-img"
                    />
                  ) : (
                    <FileText size={24} className="pl-card-icon" />
                  )}
                </div>
                <div className="pl-card-title">
                  <h4 className="pl-card-post-title">
                    {post.title || post.topic}
                  </h4>
                  <p className="pl-card-slug">/{post.slug}</p>
                </div>
              </div>

              <div className="pl-card-body">
                <div className="pl-card-row">
                  <span className="pl-card-label">AI Provider:</span>
                  <span
                    className={`pl-provider-badge ${
                      post.aiProvider || "unknown"
                    }`}
                  >
                    {post.aiProvider || "Unknown"}
                  </span>
                </div>

                <div className="pl-card-row">
                  <span className="pl-card-label">Status:</span>
                  <span
                    className={`pl-status-badge ${getStatusBadgeClass(
                      post.status
                    )}`}
                  >
                    {getStatusDisplayText(post.status)}
                  </span>
                </div>

                <div className="pl-card-row">
                  <span className="pl-card-label">Created:</span>
                  <span className="pl-card-date">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>

              <div className="pl-card-actions">
                <Link
                  to={`/posts/${post._id}`}
                  className="pl-card-action-btn pl-card-view-btn"
                >
                  <Eye size={16} />
                  <span className="pl-card-btn-text">View</span>
                </Link>
                <Link
                  to={`/posts/edit/${post._id}`}
                  className="pl-card-action-btn pl-card-edit-btn"
                >
                  <Edit size={16} />
                  <span className="pl-card-btn-text">Edit</span>
                </Link>
                <button
                  className="pl-card-action-btn pl-card-delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  <Trash2 size={16} />
                  <span className="pl-card-btn-text">Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="pl-empty-state">
            <FileText size={48} className="pl-empty-icon" />
            <h4 className="pl-empty-title">No posts found</h4>
            <p className="pl-empty-text">
              Try changing your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {totalPosts > 0 && (
        <div className="pl-pagination">
          <button
            className="pl-pagination-btn pl-prev-btn"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            <span className="pl-pagination-text">Previous</span>
          </button>

          <div className="pl-page-numbers">
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
                  className={`pl-page-number ${
                    currentPage === pageNum ? "pl-active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pl-pagination-btn pl-next-btn"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <span className="pl-pagination-text">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
