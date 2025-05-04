import React, { useState, useEffect } from 'react';
import { FaUpload, FaFileAlt, FaCheck, FaDownload, FaTrash, FaTimes } from 'react-icons/fa';
import Loader from '../../components/Loader';
import api from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Fetch resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/resume/all');
        
        if (data.success) {
          setResumes(data.resumes);
        }
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load resumes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumes();
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file to upload');
      return;
    }
    
    try {
      setUploadLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Refresh resumes list
        const { data } = await api.get('/resume/all');
        setResumes(data.resumes);
        
        // Reset file input
        setSelectedFile(null);
        document.getElementById('resume-file').value = '';
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };
  
  // Set resume as active
  const handleSetActive = async (resumeId) => {
    try {
      setActionLoading(true);
      
      const response = await api.put(`/resume/activate/${resumeId}`);
      
      if (response.data.success) {
        // Update resumes list in state
        setResumes(prevResumes => 
          prevResumes.map(resume => ({
            ...resume,
            isActive: resume._id === resumeId
          }))
        );
      }
    } catch (err) {
      console.error('Error setting resume as active:', err);
      setError(err.response?.data?.message || 'Failed to set resume as active. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Delete a resume
  const handleDelete = async (resumeId) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/resume/${resumeId}`);
      
      if (response.data.success) {
        // Remove deleted resume from state
        setResumes(prevResumes => prevResumes.filter(resume => resume._id !== resumeId));
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError(err.response?.data?.message || 'Failed to delete resume. Please try again.');
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
        Manage Resume
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Upload and manage your resume files
      </p>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Upload Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Upload New Resume
        </h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <div className="mb-4">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload a PDF file of your resume
              </p>
            </div>
            
            <input
              type="file"
              id="resume-file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/30"
            />
            
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploadLoading}
              className={`btn btn-primary ${(!selectedFile || uploadLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {uploadLoading ? 'Uploading...' : (
                <>
                  <FaUpload className="mr-2" /> Upload Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Resumes List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          Resume History
        </h2>
        
        {resumes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Uploaded At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {resumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <FaFileAlt className="flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {resume.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(resume.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      {resume.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          <FaCheck className="mr-1" /> Active
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={`${API_URL}${resume.path}`}
                          download
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label="Download resume"
                        >
                          <FaDownload />
                        </a>
                        
                        {!resume.isActive && (
                          <button
                            onClick={() => handleSetActive(resume._id)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            aria-label="Set as active resume"
                          >
                            <FaCheck />
                          </button>
                        )}
                        
                        {!resume.isActive && (
                          <button
                            onClick={() => setDeleteConfirm(resume._id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            aria-label="Delete resume"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      
                      {/* Delete Confirmation */}
                      {deleteConfirm === resume._id && (
                        <div className="mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded text-left">
                          <p className="text-xs text-red-700 dark:text-red-400 mb-2">
                            Are you sure you want to delete this resume?
                          </p>
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              <FaTimes className="inline mr-1" /> Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(resume._id)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              disabled={actionLoading}
                            >
                              <FaCheck className="inline mr-1" /> {actionLoading ? 'Deleting...' : 'Confirm'}
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No resumes uploaded yet. Use the form above to upload your first resume.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResume; 