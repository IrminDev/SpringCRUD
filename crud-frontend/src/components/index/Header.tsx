import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
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
            <FiBook className={`h-8 w-8 mr-2 ${isScrolled ? 'text-indigo-600' : 'text-indigo-500'}`} />
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-800' : 'text-indigo-950'}`}>
              BookNexus
            </span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Explore", "Categories", "About"].map((item, index) => (
              <a 
                key={index}
                href="#"
                className={`font-medium hover:text-indigo-500 transition-colors ${
                  isScrolled ? 'text-gray-600' : 'text-indigo-950'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className={`font-medium px-4 py-2 rounded-full transition-colors ${
              isScrolled 
                ? 'text-indigo-600 hover:bg-indigo-50' 
                : 'text-indigo-950 hover:bg-white/10'
            }`}>
              <Link to="/sign-in">
                Sign In
              </Link>
            </button>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md">
              <Link to="/sign-up">
                Sign Up
              </Link>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <FiMenu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white shadow-lg mt-2"
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
                className="block py-2 text-gray-700 hover:bg-gray-50 rounded-md px-3"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <button className="text-indigo-600 font-medium py-2 rounded-md hover:bg-indigo-50">
                Sign In
              </button>
              <button className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;