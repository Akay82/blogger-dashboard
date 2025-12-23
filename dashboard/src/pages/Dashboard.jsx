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



  const fetchDashboardData = async () => {
    // Simulate API delay
    setTimeout(() => {
      // Dummy data
      const dummyPosts = [
        {
          id: 1,
          title: "Getting Started with React",
          content: "Learn how to build modern web applications with React",
          author: "John Doe",
          createdAt: "2024-01-15T10:30:00Z",
          status: "published",
          views: 1250,
          likes: 89,
          tags: ["react", "javascript", "webdev"],
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop"
        },
        {
          id: 2,
          title: "Mastering TypeScript",
          content: "TypeScript adds static typing to JavaScript for better developer experience",
          author: "Jane Smith",
          createdAt: "2024-01-20T14:45:00Z",
          status: "draft",
          views: 0,
          likes: 0,
          tags: ["typescript", "programming"],
          image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop"
        },
        {
          id: 3,
          title: "CSS Grid vs Flexbox",
          content: "A comprehensive comparison of CSS Grid and Flexbox",
          author: "Alex Johnson",
          createdAt: "2024-01-18T09:15:00Z",
          status: "published",
          views: 850,
          likes: 45,
          tags: ["css", "webdev", "frontend"],
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"
        },
        {
          id: 4,
          title: "Node.js Best Practices",
          content: "Essential best practices for Node.js development",
          author: "Mike Wilson",
          createdAt: "2024-01-22T16:20:00Z",
          status: "scheduled",
          views: 320,
          likes: 23,
          tags: ["nodejs", "backend", "javascript"],
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop"
        },
        {
          id: 5,
          title: "Introduction to GraphQL",
          content: "Learn the basics of GraphQL for API development",
          author: "Sarah Chen",
          createdAt: "2024-01-10T11:10:00Z",
          status: "published",
          views: 1560,
          likes: 102,
          tags: ["graphql", "api", "webdev"],
          image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop"
        }
      ];

      const dummyStats = {
        totalPosts: dummyPosts.length,
        totalViews: 12450,
        totalLikes: 5678,
        activeUsers: 234
      };

      setStats(dummyStats);
      setRecentPosts(dummyPosts);
      setLoading(false);
    }, 1000); // 1 second delay to simulate API call
  };
  useEffect(() => {
    // Simulate API call with dummy data
    fetchDashboardData();
  }, []);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          change={12}
          color="purple"
        />
        <StatCard
          icon={<Eye size={24} />}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change={8}
          color="blue"
        />
        <StatCard
          icon={<ThumbsUp size={24} />}
          title="Total Likes"
          value={stats.totalLikes.toLocaleString()}
          change={15}
          color="green"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Active Users"
          value={stats.activeUsers}
          change={-3}
          color="orange"
        />
      </div>

      <div className="dashboard-content">
        <div className="recent-posts">
          <div className="section-header">
            <h2>Recent Posts</h2>
            <button className="btn-secondary">View All</button>
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
                    <span className={`status-badge ${post.status || 'published'}`}>
                      {post.status || 'Published'}
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