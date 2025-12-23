import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Settings,
  Menu,
  X,
  Bell,
  Search
} from "lucide-react";
import "./Layout.css";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/posts", icon: <FileText size={20} />, label: "Posts" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    // On mobile, also close the mobile menu when toggling sidebar
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="layout-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={handleMobileMenuToggle}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="logo">BlogDash</h1>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop and Mobile */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">BlogDash</h2>
          <button 
            className="sidebar-toggle"
            onClick={handleSidebarToggle}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="search-box">
          <Search  />
          <input 
            type="text" 
            placeholder="Search..." 
            aria-label="Search"
          />
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <User size={24} />
            </div>
            <div className="user-info">
              <h4>John Doe</h4>
              <p>Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;