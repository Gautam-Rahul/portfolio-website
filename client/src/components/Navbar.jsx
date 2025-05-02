import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaSun, FaMoon, FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle theme toggle
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white dark:bg-gray-900 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Rahul Gautam
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Home
          </Link>
          <Link to="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Projects
          </Link>
          <Link to="/resume" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Resume
          </Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Contact
          </Link>
          
          {isAdmin() && (
            <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              Admin
            </Link>
          )}
          
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>
          
          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <FaUser className="inline mr-1" /> {user.username}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2">
              Home
            </Link>
            <Link to="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2">
              Projects
            </Link>
            <Link to="/resume" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2">
              Resume
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2">
              Contact
            </Link>
            
            {isAdmin() && (
              <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 py-2">
                Admin
              </Link>
            )}
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <FaUser className="inline mr-1" /> {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline w-full justify-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary w-full justify-center mt-2">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 