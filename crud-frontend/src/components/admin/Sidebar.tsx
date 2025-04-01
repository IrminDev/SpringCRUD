import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiUsers, 
  FiBook, 
  FiGrid,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

interface SidebarProps {
  darkMode: boolean;
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FiUsers />, label: 'User Management' },
    { path: '/admin/books', icon: <FiBook />, label: 'Book Catalog' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div 
      className={`h-screen fixed left-0 top-0 z-30 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } ${
        darkMode 
          ? 'bg-slate-800 text-slate-200 border-r border-slate-700' 
          : 'bg-white text-gray-800 border-r border-gray-200 shadow-sm'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between h-16 px-4 border-b transition-colors duration-500">
          {!collapsed && (
            <Link to="/admin" className="flex items-center">
              <FiBook className="h-6 w-6 text-indigo-500" />
              <span className="ml-2 font-bold text-lg">BookNexus</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin" className="mx-auto">
              <FiBook className="h-6 w-6 text-indigo-500" />
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className={`p-1 rounded-full transition-colors ${
              darkMode 
                ? 'hover:bg-slate-700' 
                : 'hover:bg-gray-200'
            }`}
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-800'}`
                      : `${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;