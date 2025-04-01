import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import User from '../../model/User';

interface TopBarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ darkMode, toggleTheme }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <div className={`h-16 px-6 flex items-center justify-between border-b ${
      darkMode 
        ? 'bg-slate-800 border-slate-700 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <h1 className="text-xl font-semibold">BookNexus Admin</h1>

      {/* Right side actions */}
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center focus:outline-none"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
              darkMode ? 'bg-slate-700 border-slate-600' : 'bg-indigo-100 border-indigo-200'
            }`}>
              <FiUser className={darkMode ? 'text-indigo-300' : 'text-indigo-600'} />
            </div>
            {user && (
              <span className="ml-2 hidden md:block">{user.name}</span>
            )}
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div 
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                darkMode ? 'bg-slate-700' : 'bg-white'
              }`}
            >
              <div className="py-1">
                <button 
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    darkMode 
                      ? 'hover:bg-slate-600 text-white' 
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;