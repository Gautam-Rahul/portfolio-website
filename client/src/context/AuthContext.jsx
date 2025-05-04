import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Fetch current user using our API utility with auto token handling
        const { data } = await api.get('/auth/me');
        
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Clear token if it's invalid
        localStorage.removeItem('token');
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

      // Use the API utility for login
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
        const token = response.data.token;
        localStorage.setItem('token', token);
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
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user state and localStorage
      setUser(null);
      localStorage.removeItem('token');
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