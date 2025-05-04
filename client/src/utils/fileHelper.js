// Helper functions for handling file URLs in different environments
import { getApiUrl } from './api';

/**
 * Gets the correct URL for a file based on the environment
 * @param {string} filePath - The file path (e.g., 'projects/image.jpg' or 'resume/cv.pdf')
 * @returns {string} The complete URL to the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  
  const apiBaseUrl = getApiUrl();
  console.log('File URL base:', apiBaseUrl);
  
  // For Vercel deployment, GitHub Pages deployment, or any non-localhost environment
  if (apiBaseUrl.includes('vercel.app') || 
      window.location.hostname.includes('github.io') || 
      (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'))) {
    const fileUrl = `${apiBaseUrl}/uploads?filename=${encodeURIComponent(filePath)}`;
    console.log('Using production file URL:', fileUrl);
    return fileUrl;
  }
  
  // For local development, use the direct path
  const localFileUrl = `${apiBaseUrl.replace('/api', '')}/uploads/${filePath}`;
  console.log('Using local file URL:', localFileUrl);
  return localFileUrl;
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