import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import Loader from '../components/Loader';
import api, { getApiUrl } from '../utils/api';
import { getFileUrl } from '../utils/fileHelper';

// Get the API URL for this component
const API_URL = getApiUrl();
console.log('Projects component using API URL:', API_URL);

// Static mock data for projects
const MOCK_PROJECTS = [
  {
    _id: 'proj1',
    title: 'E-Commerce Website',
    description: 'A full-stack e-commerce platform with shopping cart, user authentication, and payment integration.',
    imageUrl: 'https://picsum.photos/id/0/600/400',
    liveLink: 'https://example.com/ecommerce',
    repoLink: 'https://github.com/example/ecommerce',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux']
  },
  {
    _id: 'proj2',
    title: 'Task Management App',
    description: 'A task management application with drag-and-drop functionality, task prioritization, and team collaboration.',
    imageUrl: 'https://picsum.photos/id/1/600/400',
    liveLink: 'https://example.com/tasks',
    repoLink: 'https://github.com/example/tasks',
    technologies: ['React', 'Firebase', 'Material UI', 'Redux']
  },
  {
    _id: 'proj3',
    title: 'Weather Dashboard',
    description: 'A weather dashboard that provides real-time weather data, forecasts, and historical weather information.',
    imageUrl: 'https://picsum.photos/id/2/600/400',
    liveLink: 'https://example.com/weather',
    repoLink: 'https://github.com/example/weather',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Weather API']
  }
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Load mock projects data
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    
    try {
      console.log('Using mock projects data instead of API call');
      // Wait a bit to simulate network request
      setTimeout(() => {
        setProjects(MOCK_PROJECTS);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error setting mock projects:', err);
      setError('Failed to load projects. Please try again later.');
      setLoading(false);
    }
  }, []);
  
  // Get unique technologies from all projects
  const getAllTechnologies = () => {
    const techSet = new Set();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return ['all', ...Array.from(techSet)];
  };
  
  // Filter projects by search term and tech filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || project.technologies.includes(filter);
    
    return matchesSearch && matchesFilter;
  });
  
  if (loading) return <Loader size="large" />;
  
  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          My Projects
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-400">
          Explore some of the projects I've worked on
        </p>
        
        {/* Filters and Search */}
        <div className="mb-12 flex flex-col md:flex-row justify-between gap-6">
          {/* Technology Filter */}
          <div className="flex flex-wrap gap-2">
            {getAllTechnologies().map((tech, index) => (
              <button
                key={index}
                onClick={() => setFilter(tech)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === tech
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tech.charAt(0).toUpperCase() + tech.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No projects match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const { title, description, imageUrl, liveLink, repoLink, technologies } = project;
  
  return (
    <div className="card overflow-hidden bg-white dark:bg-gray-700 rounded-xl group transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/40 h-full flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with links */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-blue-500 hover:text-white transition-colors duration-300"
              aria-label="View Live Site"
            >
              <FaExternalLinkAlt />
            </a>
          )}
          
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-blue-500 hover:text-white transition-colors duration-300"
              aria-label="View Source Code"
            >
              <FaGithub />
            </a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects; 