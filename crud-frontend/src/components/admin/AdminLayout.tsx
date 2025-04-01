import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import User from '../../model/User';

interface AdminLayoutProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ darkMode, toggleTheme }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication and admin role
  useEffect(() => {
    const user: User = JSON.parse(localStorage.getItem("user") || "{ id: 0, name: '', email: '' }");
    if (user.id === 0) {
      navigate("/sign-in");
    } else if (user.role !== "ADMIN") {
      navigate("/");
    }
  }, [navigate]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Sidebar 
        darkMode={darkMode} 
        collapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <TopBar 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
        />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;