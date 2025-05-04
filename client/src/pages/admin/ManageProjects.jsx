import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [currentProject, setCurrentProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveLink: '',
    repoLink: '',
    featured: false,
    order: 0,
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/projects');
        
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle file input
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      return;
    }
    
    // Handle checkbox input
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    // Handle other inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.technologies.trim()) {
      errors.technologies = 'At least one technology is required';
    }
    
    // Only require image for new projects
    if (formMode === 'add' && !formData.image && !formData.imageUrl) {
      errors.image = 'Please select an image';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      
      // Process technologies string into an array
      const techArray = formData.technologies.split(',').map(tech => tech.trim());
      formDataObj.append('technologies', JSON.stringify(techArray));
      
      formDataObj.append('liveLink', formData.liveLink);
      formDataObj.append('repoLink', formData.repoLink);
      formDataObj.append('featured', formData.featured);
      formDataObj.append('order', formData.order);
      
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      let response;
      
      if (formMode === 'add') {
        response = await api.post('/projects', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.put(`/projects/${currentProject._id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      if (response.data.success) {
        // Refresh projects list
        const { data } = await api.get('/projects');
        setProjects(data.projects);
        
        // Reset form
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.response?.data?.message || 'Failed to save project. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Handle editing a project
  const handleEdit = (project) => {
    setFormMode('edit');
    setCurrentProject(project);
    
    // Convert technologies array to comma-separated string
    const technologiesString = Array.isArray(project.technologies) 
      ? project.technologies.join(', ')
      : '';
    
    setFormData({
      title: project.title,
      description: project.description,
      technologies: technologiesString,
      liveLink: project.liveLink || '',
      repoLink: project.repoLink || '',
      featured: project.featured || false,
      order: project.order || 0,
      image: null,
      imageUrl: project.imageUrl
    });
    
    setShowForm(true);
  };
  
  // Handle deleting a project
  const handleDelete = async (projectId) => {
    try {
      setSubmitLoading(true);
      
      const response = await api.delete(`/projects/${projectId}`);
      
      if (response.data.success) {
        // Remove project from state
        setProjects(projects.filter(project => project._id !== projectId));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.message || 'Failed to delete project. Please try again.');
    } finally {
      setDeleteConfirm(null);
      setSubmitLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      liveLink: '',
      repoLink: '',
      featured: false,
      order: 0,
      image: null,
      imageUrl: null
    });
    setFormErrors({});
    setCurrentProject(null);
    setFormMode('add');
  };
  
  if (loading) return <Loader />;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Projects
        </h1>
        
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn btn-primary px-4 py-2 flex items-center gap-2"
        >
          {showForm ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPlus /> Add Project
            </>
          )}
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Project Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {formMode === 'add' ? 'Add New Project' : 'Edit Project'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-2">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Project title"
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`textarea ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Project description"
                rows={4}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>
            
            {/* Technologies */}
            <div className="mb-4">
              <label htmlFor="technologies" className="block text-gray-700 dark:text-gray-300 mb-2">
                Technologies* (comma separated)
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className={`input ${formErrors.technologies ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="React, Node.js, MongoDB, etc."
              />
              {formErrors.technologies && (
                <p className="text-red-500 text-sm mt-1">{formErrors.technologies}</p>
              )}
            </div>
            
            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="liveLink" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  id="liveLink"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label htmlFor="repoLink" className="block text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  id="repoLink"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
            
            {/* Featured and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4"
                  />
                  Featured Project
                </label>
              </div>
              
              <div>
                <label htmlFor="order" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="input"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 mb-2">
                Project Image {formMode === 'add' && '*'}
              </label>
              
              {/* Current image preview (for edit mode) */}
              {formMode === 'edit' && formData.imageUrl && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current image:</p>
                  <img
                    src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `${API_URL}${formData.imageUrl}`}
                    alt="Current project"
                    className="h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className={`block w-full text-gray-700 dark:text-gray-300 ${
                  formErrors.image ? 'border-red-500 dark:border-red-500' : ''
                }`}
                accept="image/*"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formMode === 'edit' ? 'Leave empty to keep current image' : 'Select a project image'}
              </p>
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="btn btn-outline mr-2"
                disabled={submitLoading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={submitLoading}
                className={`btn btn-primary ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitLoading ? 'Saving...' : formMode === 'add' ? 'Add Project' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Technologies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          <img
                            src={project.imageUrl.startsWith('http') ? project.imageUrl : `${API_URL}${project.imageUrl}`}
                            alt={project.title}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {project.description.length > 60 
                              ? `${project.description.substring(0, 60)}...` 
                              : project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {project.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          <FaStar className="mr-1" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {project.order}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ${
                            !project.liveLink && 'pointer-events-none opacity-40'
                          }`}
                          aria-label="View live demo"
                        >
                          <FaEye />
                        </a>
                        
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          aria-label="Edit project"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => setDeleteConfirm(project._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete project"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      {/* Delete Confirmation */}
                      {deleteConfirm === project._id && (
                        <div className="mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded text-left">
                          <p className="text-xs text-red-700 dark:text-red-400 mb-2">
                            Are you sure you want to delete this project?
                          </p>
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              <FaTimes className="inline mr-1" /> Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              disabled={submitLoading}
                            >
                              <FaCheck className="inline mr-1" /> {submitLoading ? 'Deleting...' : 'Confirm'}
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
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            No projects found. Click "Add Project" to create your first project.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageProjects; 