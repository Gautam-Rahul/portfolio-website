import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn,
  FaDownload, FaArrowRight, FaReact, FaNodeJs,
  FaDatabase, FaCode, FaServer, FaMountain,
  FaGamepad, FaMusic, FaBook, FaCamera
} from 'react-icons/fa';
import {
  SiMongodb, SiExpress, SiJavascript,
  SiHtml5, SiCss3, SiTailwindcss
} from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';
import api, { getApiUrl } from '../utils/api';
import { getFileUrl } from '../utils/fileHelper';
import { ParticlesBackground } from '../components/ParticlesBackground';

// Get the API URL for this component
const API_URL = getApiUrl();
console.log('Home component using API URL:', API_URL);

const Home = () => {
  const { isDarkMode } = useTheme();
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        console.log('Fetching resume from:', `${API_URL}/resume/active`);
        const { data } = await api.get('/resume/active');
        
        if (data.success) {
          // Use the fileHelper utility to get the correct URL for the file
          setResumeUrl(getFileUrl(data.resume.path));
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, []);

  const socialLinks = [
    { icon: <FaInstagram size={20} />, url: 'https://www.instagram.com/captain._.rahul/', label: 'Instagram', color: 'hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500' },
    { icon: <FaFacebookF size={20} />, url: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <FaTwitter size={20} />, url: '#', label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: <FaLinkedinIn size={20} />, url: 'https://linkedin.com/in/rahul-gautam-778a622a7', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ];

  const skills = [
    { name: 'JavaScript', icon: <SiJavascript className="text-yellow-400" size={24} />, level: 90 },
    { name: 'React', icon: <FaReact className="text-blue-500" size={24} />, level: 95 },
    { name: 'Node.js', icon: <FaNodeJs className="text-green-600" size={24} />, level: 85 },
    { name: 'Express', icon: <SiExpress className="text-gray-600 dark:text-gray-300" size={24} />, level: 80 },
    { name: 'MongoDB', icon: <SiMongodb className="text-green-500" size={24} />, level: 85 },
    { name: 'HTML', icon: <SiHtml5 className="text-orange-600" size={24} />, level: 95 },
    { name: 'CSS', icon: <SiCss3 className="text-blue-600" size={24} />, level: 90 },
    { name: 'TailwindCSS', icon: <SiTailwindcss className="text-cyan-500" size={24} />, level: 90 }
  ];

  const hobbies = [
    { name: 'Hiking', icon: <FaMountain className="text-green-700" size={24} />, description: 'Exploring nature trails and mountains' },
    { name: 'Gaming', icon: <FaGamepad className="text-purple-600" size={24} />, description: 'Competitive and story-driven video games' },
    { name: 'Music', icon: <FaMusic className="text-red-500" size={24} />, description: 'Playing guitar and listening to various genres' },
    { name: 'Reading', icon: <FaBook className="text-yellow-800" size={24} />, description: 'Science fiction and technical books' },
    { name: 'Photography', icon: <FaCamera className="text-blue-500" size={24} />, description: 'Capturing landscapes and urban scenes' }
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Particles Background with reduced opacity */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground mousePosition={mousePosition} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center pt-20">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-10">
            {/* Left: Text */}
            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                Full Stack Web Developer
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Rahul Gautam</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                I build responsive web applications using the MERN stack and modern UI frameworks.
              </p>

              <div className="flex gap-3 justify-center md:justify-start">
                {socialLinks.map(({ icon, url, label, color }, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all hover:text-white transform hover:scale-110 ${color}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-3">
                {!loading && (
                  resumeUrl ? (
                    <a
                      href={resumeUrl}
                      download="Rahul_Gautam_Resume.pdf"
                      className="btn btn-primary px-6 py-2 rounded-full flex items-center gap-2"
                    >
                      <FaDownload /> Download Resume
                    </a>
                  ) : (
                    <Link to="/resume" className="btn btn-primary px-6 py-2 rounded-full flex items-center gap-2">
                      View Resume
                    </Link>
                  )
                )}
                <Link to="/projects" className="btn btn-outline px-6 py-2 rounded-full flex items-center gap-2">
                  View Projects <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
                <img
                  src="https://avatars.githubusercontent.com/u/61191660?s=400"
                  alt="Rahul Gautam profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">My Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map(({ name, icon, level }, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow hover:-translate-y-1 transition transform">
                  <div className="flex flex-col items-center">
                    <div className="mb-2">{icon}</div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{name}</h3>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${level}%` }}></div>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">What I Do</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Frontend Development',
                  icon: <FaCode className="h-7 w-7" />,
                  desc: 'Building responsive interfaces with React and modern CSS frameworks.',
                },
                {
                  title: 'Backend Development',
                  icon: <FaServer className="h-7 w-7" />,
                  desc: 'Creating APIs with Node.js and Express, integrating MongoDB.',
                },
                {
                  title: 'Database Design',
                  icon: <FaDatabase className="h-7 w-7" />,
                  desc: 'Designing schemas and optimizing queries for performance.',
                }
              ].map(({ title, icon, desc }, i) => (
                <div key={i} className="card p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:-translate-y-2 transition">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Hobbies & Interests</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {hobbies.map(({ name, icon, description }, i) => (
                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:-translate-y-1 transition flex flex-col items-center text-center">
                  <div className="mb-3 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">{icon}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-10 mt-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to work together?</h2>
            <p className="text-lg mb-6 max-w-xl mx-auto">Let's discuss your project and see how I can help bring your ideas to life.</p>
            <Link
              to="/contact"
              className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Let's Connect <FaArrowRight className="inline ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
