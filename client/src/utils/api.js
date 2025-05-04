import axios from 'axios';

// Get the API URL from environment variables, with fallbacks for different environments
export const getApiUrl = () => {
  // Add debugging to check hostname
  console.log('Current hostname:', window.location.hostname);
  
  /* 
   * ============================================================
   * IMPORTANT: We are intentionally ignoring the VITE_API_URL
   * environment variable and using mock data for all environments
   * ============================================================
   */
  // For production builds, we would normally use VITE_API_URL, but we're ignoring it for now
  if (false && import.meta.env.VITE_API_URL) {
    console.log('Found VITE_API_URL but ignoring it to use mock data');
    // return import.meta.env.VITE_API_URL;
  }
  
  console.log('Using MOCK DATA for API calls - no backend connection required');
  
  // Always return a dummy URL since we're not actually making API calls
  return 'https://mock-api-not-used.example.com/api';
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