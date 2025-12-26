import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Eye, 
  ThumbsUp,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  Settings
} from "lucide-react";
import "./Dashboard.css";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon, title, value, change, color }) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>
      {icon}
    </div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
      {change && (
        <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
          <TrendingUp size={14} /> {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    activeUsers: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/summary");
      const data = response.data;
      
      // Transform API data to match your UI structure
      setStats({
        totalPosts: data.posts?.total || 0,
        totalViews: data.analytics?.totalViews || 0,
        totalLikes: 0, // API doesn't provide likes data
        activeUsers: 0 // API doesn't provide active users data
      });

      // Transform recent posts data
      const transformedPosts = data.recentPosts?.map((post, index) => ({
        id: post._id || `post-${index}`,
        title: post.title || "Unknown Post",
        content: post.title, // Using title as content since API doesn't have content
        author: "Blogger", // Default author since API doesn't have author info
        createdAt: post.createdAt || new Date().toISOString(),
        status: post.status || "unknown",
        views: 0, // Not available in API for recent posts
        likes: 0, // Not available in API for recent posts
        tags: [], // Not available in API
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop", // Default image
        slug: post.slug || "",
        postUrl: post.blogger?.postUrl || "#"
      })) || [];

      setRecentPosts(transformedPosts);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // You could set error state here if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your blog.</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FileText size={24} />}
          title="Total Posts"
          value={stats.totalPosts}
          change={0} // No change data in API
          color="purple"
        />
        <StatCard
          icon={<Eye size={24} />}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change={0} // No change data in API
          color="blue"
        />
        <StatCard
          icon={<ThumbsUp size={24} />}
          title="Total Likes"
          value={stats.totalLikes.toLocaleString()}
          change={0} // No change data in API
          color="green"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Active Users"
          value={stats.activeUsers}
          change={0} // No change data in API
          color="orange"
        />
      </div>

      <div className="dashboard-content">
        <div className="recent-posts">
          <div className="section-header">
            <h2>Recent Posts</h2>
            <button   onClick={() => navigate('/posts')}  className="btn-secondary">View All</button>
          </div>
          <div className="posts-table">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="post-row">
                  <div className="post-info">
                    <h4>{post.title}</h4>
                    <div className="post-meta">
                      <span><Calendar size={14} /> {formatDate(post.createdAt)}</span>
                      <span><Eye size={14} /> {post.views || 0}</span>
                      <span><ThumbsUp size={14} /> {post.likes || 0}</span>
                    </div>
                  </div>
                  <div className="post-status">
                    <span className={`status-badge ${post.status || 'generated'}`}>
                      {post.status || 'Generated'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-posts">
                <FileText size={32} />
                <p>No posts found. Create your first post!</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn primary">
              <FileText size={20} />
              <span>Create New Post</span>
            </button>
            <button className="action-btn secondary">
              <BarChart3 size={20} />
              <span>View Analytics</span>
            </button>
            <button className="action-btn success">
              <Users size={20} />
              <span>Manage Users</span>
            </button>
            <button className="action-btn warning">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;