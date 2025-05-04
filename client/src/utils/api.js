import axios from 'axios';

// Get the API URL from environment variables, with fallbacks for different environments
export const getApiUrl = () => {
  // For production builds, use the VITE_API_URL from environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For GitHub Pages deployment, use the Vercel backend URL
  if (window.location.hostname.includes('github.io')) {
    return 'https://portfolio-webite-server.vercel.app/api';
  }
  
  // For local development, default to localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('Using API URL:', API_URL); // Helpful for debugging

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 