import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { 
      icon: <FaInstagram />, 
      url: 'https://www.instagram.com/captain._.rahul/', 
      label: 'Instagram' 
    },
    { 
      icon: <FaFacebookF />, 
      url: '#', 
      label: 'Facebook' 
    },
    { 
      icon: <FaTwitter />, 
      url: '#', 
      label: 'Twitter' 
    },
    { 
      icon: <FaGithub />, 
      url: '#', 
      label: 'GitHub' 
    },
    { 
      icon: <FaLinkedinIn />, 
      url: 'https://linkedin.com/in/rahul-gautam-778a622a7', 
      label: 'LinkedIn' 
    }
  ];
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Rahul Gautam</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Web Developer specializing in MERN stack development. Building responsive and scalable web applications.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/resume" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Resume
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="mt-1 text-blue-500">
                  <FaEnvelope />
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  rahu.gtm114@gmail.com
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 text-blue-500">
                  <FaPhoneAlt />
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  0452 575 573
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 text-blue-500">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  344 Mowbray Road, Artarmon, NSW
                </span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Stay Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to my newsletter for updates on new projects and articles.
            </p>
            <form className="flex">
              <input 
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md font-medium transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Rahul Gautam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 