import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaDownload, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const { isDarkMode } = useTheme();
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  
  // Fetch active resume URL
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${API_URL}/resume/active`);
        if (response.data.success) {
          setResumeUrl(`${API_URL}${response.data.resume.path}`);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, []);
  
  const socialLinks = [
    { 
      icon: <FaInstagram size={20} />, 
      url: 'https://www.instagram.com/captain._.rahul/', 
      color: 'hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500',
      label: 'Instagram'
    },
    { 
      icon: <FaFacebookF size={20} />, 
      url: '#', 
      color: 'hover:bg-blue-600',
      label: 'Facebook'
    },
    { 
      icon: <FaTwitter size={20} />, 
      url: '#', 
      color: 'hover:bg-blue-400',
      label: 'Twitter'
    },
    { 
      icon: <FaLinkedinIn size={20} />, 
      url: 'https://linkedin.com/in/rahul-gautam-778a622a7', 
      color: 'hover:bg-blue-700',
      label: 'LinkedIn'
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:min-h-[calc(100vh-80px)] flex flex-col justify-center relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Text Content */}
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                Full Stack Web Developer
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Rahul Gautam</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                I build responsive web applications with modern technologies. Specializing in MERN stack development and creating beautiful user experiences.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    download="Rahul_Gautam_Resume.pdf"
                    className="btn btn-primary px-8 py-3 rounded-full flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Download Resume
                  </a>
                ) : (
                  <Link
                    to="/resume"
                    className="btn btn-primary px-8 py-3 rounded-full flex items-center justify-center gap-2"
                  >
                    View Resume
                  </Link>
                )}
                
                <Link
                  to="/projects"
                  className="btn btn-outline px-8 py-3 rounded-full flex items-center justify-center gap-2"
                >
                  View Projects <FaArrowRight />
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
                <img
                  src="https://avatars.githubusercontent.com/u/61191660?s=400&u=66653bff8f6419c3069565cb7f64c8bbb37f67d3&v=4"
                  alt="Rahul Gautam"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll Down</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center pt-1">
            <div className="w-1.5 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </section>
      
      {/* Quick Overview Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto mb-16">What I Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frontend Development */}
            <div className="card bg-white dark:bg-gray-700 p-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Frontend Development</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Building responsive and interactive user interfaces using modern frontend frameworks like React. Creating pixel-perfect designs with attention to detail.
              </p>
            </div>
            
            {/* Backend Development */}
            <div className="card bg-white dark:bg-gray-700 p-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Backend Development</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Developing robust and scalable APIs using Node.js and Express. Working with databases like MongoDB to create efficient data models and queries.
              </p>
            </div>
            
            {/* Web Design */}
            <div className="card bg-white dark:bg-gray-700 p-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Web Design</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating beautiful and intuitive interfaces with a focus on user experience. Designing responsive layouts that work across all devices.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/contact" className="btn btn-primary px-8 py-3 rounded-full inline-flex items-center gap-2">
              Let's Work Together <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 