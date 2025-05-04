// Helper functions for handling file URLs in different environments

/**
 * Gets the correct URL for a file based on the environment
 * @param {string} filePath - The file path (e.g., 'projects/image.jpg' or 'resume/cv.pdf')
 * @returns {string} The complete URL to the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // For Vercel deployment, use the special uploads endpoint
  if (apiBaseUrl.includes('vercel.app')) {
    return `${apiBaseUrl}/uploads?filename=${encodeURIComponent(filePath)}`;
  }
  
  // For GitHub Pages or local development, use the direct path
  return `${apiBaseUrl.replace('/api', '')}/uploads/${filePath}`;
};

/**
 * Determines if a file URL is from Vercel
 * @param {string} url - The URL to check
 * @returns {boolean} True if it's a Vercel URL
 */
export const isVercelFileUrl = (url) => {
  return url && url.includes('vercel.app');
};

export default {
  getFileUrl,
  isVercelFileUrl
}; 