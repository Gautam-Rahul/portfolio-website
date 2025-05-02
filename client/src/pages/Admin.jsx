import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaChartPie, FaFolderOpen, FaFileAlt, FaEnvelope, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Navigation links for sidebar
  const navLinks = [
    {
      to: '/admin',
      icon: <FaChartPie />,
      text: 'Dashboard',
      end: true
    },
    {
      to: '/admin/projects',
      icon: <FaFolderOpen />,
      text: 'Projects',
      end: false
    },
    {
      to: '/admin/resume',
      icon: <FaFileAlt />,
      text: 'Resume',
      end: false
    },
    {
      to: '/admin/messages',
      icon: <FaEnvelope />,
      text: 'Messages',
      end: false
    }
  ];
  
  return (
    <div className="min-h-screen pt-16 pb-0 flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-20 right-4 md:hidden z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } pt-20 md:pt-20 pb-6 h-full flex flex-col`}
      >
        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-grow py-6 px-4 space-y-1">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="px-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Main Content */}
      <main className="flex-grow p-6 md:ml-0 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin; 