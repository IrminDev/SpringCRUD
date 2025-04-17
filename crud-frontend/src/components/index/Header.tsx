import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiHome, FiSearch, FiGrid, FiInfo, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import User from '../../model/User';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? (darkMode 
              ? 'bg-slate-900 shadow-lg shadow-black/20 py-2' 
              : 'bg-white shadow-md py-2') 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
              <FiBook className={`h-8 w-8 mr-2 ${
                isScrolled 
                  ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') 
                  : (darkMode ? 'text-indigo-400' : 'text-indigo-500')
              }`} />
              <span className={`text-xl font-bold ${
                isScrolled 
                  ? (darkMode ? 'text-white' : 'text-gray-800') 
                  : (darkMode ? 'text-white' : 'text-indigo-950')
              }`}>
                BookNexus
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`font-medium transition-colors flex items-center ${
                isScrolled 
                  ? (darkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500') 
                  : (darkMode ? 'text-slate-200 hover:text-indigo-400' : 'text-indigo-950 hover:text-indigo-500')
              }`}
            >
              <FiHome className="mr-1" /> Home
            </Link>
            <Link 
              to="/search"
              className={`font-medium transition-colors flex items-center ${
                isScrolled 
                  ? (darkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500') 
                  : (darkMode ? 'text-slate-200 hover:text-indigo-400' : 'text-indigo-950 hover:text-indigo-500')
              }`}
            >
              <FiSearch className="mr-1" /> Explore
            </Link>
            <Link 
              to="/categories"
              className={`font-medium transition-colors flex items-center ${
                isScrolled 
                  ? (darkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500') 
                  : (darkMode ? 'text-slate-200 hover:text-indigo-400' : 'text-indigo-950 hover:text-indigo-500')
              }`}
            >
              <FiGrid className="mr-1" /> Categories
            </Link>
            <Link 
              to="/about"
              className={`font-medium transition-colors flex items-center ${
                isScrolled 
                  ? (darkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500') 
                  : (darkMode ? 'text-slate-200 hover:text-indigo-400' : 'text-indigo-950 hover:text-indigo-500')
              }`}
            >
              <FiInfo className="mr-1" /> About
            </Link>
          </nav>
          
          {/* Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30' 
                  : 'bg-gradient-to-r from-amber-300 to-orange-400 shadow-lg shadow-amber-300/30'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center"
                >
                  {darkMode ? (
                    <FiSun className="w-5 h-5 text-white" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
            
            {/* Show either auth buttons or user profile */}
            {!user ? (
              // Auth buttons when not logged in
              <>
                <Link 
                  to="/sign-in"
                  className={`font-medium px-4 py-2 rounded-full transition-colors ${
                    isScrolled 
                      ? (darkMode 
                          ? 'text-indigo-400 hover:bg-slate-800' 
                          : 'text-indigo-600 hover:bg-indigo-50') 
                      : (darkMode 
                          ? 'text-indigo-300 hover:bg-white/10' 
                          : 'text-indigo-950 hover:bg-white/10')
                  }`}
                >
                  Sign In
                </Link>
                
                <Link 
                  to="/sign-up"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // User profile when logged in
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                    isScrolled
                      ? (darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100')
                      : (darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10')
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-indigo-700' : 'bg-indigo-100'
                  }`}>
                    <FiUser className={`h-4 w-4 ${
                      darkMode ? 'text-indigo-200' : 'text-indigo-700'
                    }`} />
                  </div>
                  <span className={`font-medium ${
                    isScrolled
                      ? (darkMode ? 'text-white' : 'text-gray-800')
                      : (darkMode ? 'text-white' : 'text-indigo-950')
                  }`}>
                    {user.name.split(' ')[0]}
                  </span>
                  <FiChevronDown className={`h-4 w-4 ${
                    isScrolled
                      ? (darkMode ? 'text-slate-400' : 'text-gray-500')
                      : (darkMode ? 'text-slate-300' : 'text-indigo-900')
                  }`} />
                </button>
                
                {/* User dropdown menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
                        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className={`px-4 py-2 border-b ${
                        darkMode ? 'border-slate-700 text-slate-200' : 'border-gray-200 text-gray-700'
                      }`}>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'ADMIN' && (
                        <Link 
                          to="/admin"
                          className={`block px-4 py-2 text-sm ${
                            darkMode 
                              ? 'text-indigo-400 hover:bg-slate-700' 
                              : 'text-indigo-600 hover:bg-gray-100'
                          }`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link 
                        to="/home"
                        className={`block px-4 py-2 text-sm ${
                          darkMode 
                            ? 'text-slate-300 hover:bg-slate-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          darkMode 
                            ? 'text-red-400 hover:bg-slate-700' 
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-2" /> 
                          Sign Out
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30' 
                  : 'bg-gradient-to-r from-amber-300 to-orange-400 shadow-md shadow-amber-300/30'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <FiSun className="w-4 h-4 text-white" />
              ) : (
                <FiMoon className="w-4 h-4 text-white" />
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className={`h-6 w-6 ${
                  isScrolled 
                    ? (darkMode ? 'text-white' : 'text-gray-800') 
                    : (darkMode ? 'text-white' : 'text-indigo-950')
                }`} />
              ) : (
                <FiMenu className={`h-6 w-6 ${
                  isScrolled 
                    ? (darkMode ? 'text-white' : 'text-gray-800') 
                    : (darkMode ? 'text-white' : 'text-indigo-950')
                }`} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className={`md:hidden shadow-lg mt-2 ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/"
                className={`flex items-center py-2 rounded-md px-3 ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHome className="mr-2" /> Home
              </Link>
              
              <Link 
                to="/search"
                className={`flex items-center py-2 rounded-md px-3 ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiSearch className="mr-2" /> Explore
              </Link>
              
              <Link 
                to="/categories"
                className={`flex items-center py-2 rounded-md px-3 ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiGrid className="mr-2" /> Categories
              </Link>
              
              <Link 
                to="/about"
                className={`flex items-center py-2 rounded-md px-3 ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiInfo className="mr-2" /> About
              </Link>
              
              {/* Show different options based on auth status */}
              <div className="pt-4 flex flex-col space-y-3">
                {!user ? (
                  // Auth buttons for logged out users
                  <>
                    <Link 
                      to="/sign-in"
                      className={`flex justify-center items-center font-medium py-2 rounded-md ${
                        darkMode 
                          ? 'text-indigo-400 hover:bg-slate-700' 
                          : 'text-indigo-600 hover:bg-indigo-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/sign-up"
                      className={`flex justify-center items-center py-2 rounded-md text-white ${
                        darkMode 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  // User options for logged in users
                  <>
                    {user.role === 'ADMIN' && (
                      <Link 
                        to="/admin"
                        className={`flex items-center py-2 rounded-md px-3 ${
                          darkMode 
                            ? 'text-indigo-400 hover:bg-slate-700' 
                            : 'text-indigo-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link 
                      to="/home"
                      className={`flex items-center py-2 rounded-md px-3 ${
                        darkMode 
                          ? 'text-slate-300 hover:bg-slate-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> My Profile
                    </Link>
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center py-2 rounded-md px-3 ${
                        darkMode 
                          ? 'text-red-400 hover:bg-slate-700' 
                          : 'text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <FiLogOut className="mr-2" /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;