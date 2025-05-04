import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Loader from '../../components/Loader';
import api from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/contact');
        
        if (data.success) {
          setMessages(data.contacts);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Handle viewing a message (mark as read)
  const handleViewMessage = async (message) => {
    setActiveMessage(message);
    
    // If message is unread, mark as read
    if (!message.read) {
      try {
        setActionLoading(true);
        
        const response = await api.put(`/contact/${message._id}/read`);
        
        if (response.data.success) {
          // Update message in state
          setMessages(messages.map(msg => 
            msg._id === message._id ? { ...msg, read: true } : msg
          ));
          
          // Update active message
          setActiveMessage(prev => ({ ...prev, read: true }));
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
        setError(err.response?.data?.message || 'Failed to mark message as read.');
      } finally {
        setActionLoading(false);
      }
    }
  };
  
  // Handle deleting a message
  const handleDelete = async (messageId) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/contact/${messageId}`);
      
      if (response.data.success) {
        // Remove message from state
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        
        // If active message is deleted, close it
        if (activeMessage && activeMessage._id === messageId) {
          setActiveMessage(null);
        }
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.response?.data?.message || 'Failed to delete message. Please try again.');
    } finally {
      setDeleteConfirm(null);
      setActionLoading(false);
    }
  };
  
  // Format date from ISO string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) return <Loader />;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Messages
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Manage contact form submissions
      </p>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {messages.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Messages List */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <h2 className="p-4 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200">
              All Messages ({messages.length})
            </h2>
            
            <div className="overflow-y-auto max-h-[600px]">
              {messages.map((message) => (
                <div 
                  key={message._id}
                  onClick={() => handleViewMessage(message)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200 ${
                    activeMessage && activeMessage._id === message._id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  } ${
                    !message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${!message.read ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                      {!message.read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium truncate ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {message.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(message.createdAt).split(',')[0]}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {message.email}
                      </p>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message Details */}
          <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {activeMessage ? (
              <div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                    Message from {activeMessage.name}
                  </h2>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(activeMessage._id);
                    }}
                    disabled={actionLoading}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete message"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                {deleteConfirm === activeMessage._id && (
                  <div className="m-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm">
                    <p className="text-red-700 dark:text-red-400 mb-2">
                      Are you sure you want to delete this message?
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(null);
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <FaTimes className="inline mr-1" /> Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(activeMessage._id);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={actionLoading}
                      >
                        <FaCheck className="inline mr-1" /> {actionLoading ? 'Deleting...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">From:</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{activeMessage.name}</p>
                      <p className="text-blue-600 dark:text-blue-400">&lt;{activeMessage.email}&gt;</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date:</p>
                    <p className="text-gray-700 dark:text-gray-300">{formatDate(activeMessage.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Message:</p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {activeMessage.message}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href={`mailto:${activeMessage.email}?subject=Re: Your message on my portfolio website`}
                      className="btn btn-primary px-4 py-2 inline-flex items-center gap-2"
                    >
                      <FaEnvelope /> Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <FaEnvelope className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Select a message to view its contents</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <FaEnvelope className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No Messages Yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are no messages in your inbox. When visitors submit the contact form, their messages will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages; 