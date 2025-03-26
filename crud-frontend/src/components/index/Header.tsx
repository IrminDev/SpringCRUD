import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Explore", "Categories", "About"].map((item, index) => (
              <a 
                key={index}
                href="#"
                className={`font-medium transition-colors ${
                  isScrolled 
                    ? (darkMode ? 'text-slate-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500') 
                    : (darkMode ? 'text-slate-200 hover:text-indigo-400' : 'text-indigo-950 hover:text-indigo-500')
                }`}
              >
                {item}
              </a>
            ))}
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
            
            {/* Sign In button */}
            <button className={`font-medium px-4 py-2 rounded-full transition-colors ${
              isScrolled 
                ? (darkMode 
                    ? 'text-indigo-400 hover:bg-slate-800' 
                    : 'text-indigo-600 hover:bg-indigo-50') 
                : (darkMode 
                    ? 'text-indigo-300 hover:bg-white/10' 
                    : 'text-indigo-950 hover:bg-white/10')
            }`}>
              <Link to="/sign-in">
                Sign In
              </Link>
            </button>
            
            {/* Sign Up button */}
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md">
              <Link to="/sign-up">
                Sign Up
              </Link>
            </button>
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
                    : (darkMode ? 'text-white' : 'text-white')
                }`} />
              ) : (
                <FiMenu className={`h-6 w-6 ${
                  isScrolled 
                    ? (darkMode ? 'text-white' : 'text-gray-800') 
                    : (darkMode ? 'text-white' : 'text-white')
                }`} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
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
            {["Home", "Explore", "Categories", "About"].map((item, index) => (
              <a 
                key={index}
                href="#"
                className={`block py-2 rounded-md px-3 ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <button className={`font-medium py-2 rounded-md ${
                darkMode 
                  ? 'text-indigo-400 hover:bg-slate-700' 
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}>
                <Link to="/sign-in">Sign In</Link>
              </button>
              <button className={`py-2 rounded-md text-white ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}>
                <Link to="/sign-up">Sign Up</Link>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;