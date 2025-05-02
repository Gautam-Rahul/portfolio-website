import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
    
    // Clear any existing errors when component mounts
    return () => {
      setError(null);
    };
  }, [user, navigate, setError]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/admin');
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              Admin Login
            </h1>
            <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
              Sign in to access the admin dashboard
            </p>
            
            <form onSubmit={handleSubmit}>
              {/* Display error message */}
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="mb-8">
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full btn btn-primary py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            {/* Demo Credentials - Remove in production */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Demo Credentials</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Email: admin@example.com<br />
                Password: Admin@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 