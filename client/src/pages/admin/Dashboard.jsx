import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaProjectDiagram, FaFileAlt, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import Loader from '../../components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: {
      total: 0,
      unread: 0
    },
    resumes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch projects count
        const projectsResponse = await axios.get(`${API_URL}/projects`);
        
        // Fetch messages stats
        const messagesResponse = await axios.get(`${API_URL}/contact`);
        const unreadCount = await axios.get(`${API_URL}/contact/unread-count`);
        
        // Fetch resumes count
        const resumesResponse = await axios.get(`${API_URL}/resume/all`);
        
        setStats({
          projects: projectsResponse.data.count || 0,
          messages: {
            total: messagesResponse.data.count || 0,
            unread: unreadCount.data.count || 0
          },
          resumes: resumesResponse.data.count || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="p-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Overview of your portfolio website
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Projects Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Projects</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.projects}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaProjectDiagram size={20} />
            </div>
          </div>
          <Link 
            to="/admin/projects" 
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 inline-block hover:underline"
          >
            Manage projects →
          </Link>
        </div>
        
        {/* Messages Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Messages</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.messages.total}
                {stats.messages.unread > 0 && (
                  <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                    {stats.messages.unread} new
                  </span>
                )}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaEnvelope size={20} />
            </div>
          </div>
          <Link 
            to="/admin/messages" 
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 inline-block hover:underline"
          >
            View messages →
          </Link>
        </div>
        
        {/* Resume Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resumes</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resumes}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FaFileAlt size={20} />
            </div>
          </div>
          <Link 
            to="/admin/resume" 
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 inline-block hover:underline"
          >
            Manage resume →
          </Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/projects"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 flex items-center gap-3"
          >
            <FaProjectDiagram className="text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Add New Project</span>
          </Link>
          <Link
            to="/admin/resume"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 flex items-center gap-3"
          >
            <FaFileAlt className="text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Upload New Resume</span>
          </Link>
        </div>
      </div>
      
      {/* Activity Log (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaCalendarAlt size={14} />
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-200">You logged in to the admin panel</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 