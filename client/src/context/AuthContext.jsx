import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios with credentials
  axios.defaults.withCredentials = true;

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token is in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch current user
        const { data } = await axios.get(`${API_URL}/auth/me`);
        
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Clear token if it's invalid
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting login with email:', email);
      console.log('API URL:', `${API_URL}/auth/login`);

      // Simple login without extra headers or complex options
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/login`,
        data: { email, password },
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
        const token = response.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error details:', err);
      if (err.response) {
        console.error('Error status:', err.response.status);
        console.error('Error response data:', err.response.data);
        setError(err.response.data?.message || 'Login failed. Please try again.');
      } else {
        console.error('Error message:', err.message);
        setError('Login failed. Server may be unavailable.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user state and localStorage
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      isAdmin,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 