import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import Map from 'react-map-gl';
import api from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MAPBOX_TOKEN = 'pk.eyJ1IjoicmFodWxndG0xMTQiLCJhIjoiY2xzbDR6cHRrMHI3ejJrcGZ0bHFsdXNuZCJ9.eRjSdwJkLlJt0oGdMGDUYw';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Define location coordinates for the map
  const mapViewState = {
    longitude: 151.1882, // Artarmon, NSW coordinates
    latitude: -33.8039,
    zoom: 14
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Contact Me
        </h1>
        <p className="text-xl text-center mb-16 text-gray-600 dark:text-gray-400">
          Get in touch for any questions or opportunities
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Let's Connect
            </h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mt-1">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                  <a href="mailto:rahu.gtm114@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                    rahu.gtm114@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mt-1">
                  <FaPhoneAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                  <a href="tel:+61452575573" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                    0452 575 573
                  </a>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mt-1">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    344 Mowbray Road, Artarmon, NSW
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="mt-10 h-80 rounded-lg overflow-hidden shadow-md">
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={mapViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                {/* Map Marker - Updated to use our CSS classes */}
                <div 
                  className="absolute map-marker"
                  style={{ 
                    left: '50%', 
                    top: '50%', 
                    transform: 'translate(-50%, -100%)' 
                  }}
                />
              </Map>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                Send Me a Message
              </h2>
              
              {success ? (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6">
                  <p>Thank you for your message! I'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {/* Name */}
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your email address"
                      required
                    />
                  </div>
                  
                  {/* Subject */}
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      placeholder="Subject of your message"
                      required
                    />
                  </div>
                  
                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="textarea"
                      placeholder="Your message"
                      required
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full btn btn-primary py-3 flex items-center justify-center gap-2 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 