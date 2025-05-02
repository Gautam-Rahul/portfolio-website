import React from 'react';
import { FaLaptopCode, FaServer, FaMobileAlt, FaDatabase } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          About Me
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-400">
          Learn more about my skills and experience
        </p>
        
        {/* Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              My Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Hello! I'm Rahul Gautam, a passionate Full Stack Developer with expertise in building modern web applications using the MERN stack (MongoDB, Express, React, and Node.js).
              </p>
              <p>
                With a strong foundation in both frontend and backend development, I strive to create seamless, user-friendly applications that provide exceptional experiences. My journey in web development began with a curiosity about how websites work, which quickly grew into a passion for building them myself.
              </p>
              <p>
                I enjoy tackling complex problems and finding elegant solutions that balance technical requirements with user needs. My approach to development focuses on writing clean, maintainable code while staying current with the latest technologies and best practices.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or expanding my knowledge through online courses and coding challenges.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Skills & Expertise
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Frontend */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <FaLaptopCode size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>React, Redux, Context API</li>
                  <li>JavaScript (ES6+), TypeScript</li>
                  <li>HTML5, CSS3, Sass</li>
                  <li>Tailwind CSS, Material UI</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
              
              {/* Backend */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
                  <FaServer size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Backend</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Node.js, Express</li>
                  <li>RESTful API Design</li>
                  <li>Authentication & Authorization</li>
                  <li>Server-side Rendering</li>
                  <li>Middleware Development</li>
                </ul>
              </div>
              
              {/* Database */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <FaDatabase size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Database</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>MongoDB, Mongoose</li>
                  <li>SQL, MySQL, PostgreSQL</li>
                  <li>Database Design & Optimization</li>
                  <li>Data Modeling</li>
                  <li>Query Optimization</li>
                </ul>
              </div>
              
              {/* Other Skills */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                  <FaMobileAlt size={24} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Other Skills</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Git, GitHub, Version Control</li>
                  <li>CI/CD, Docker</li>
                  <li>AWS, Heroku, Vercel</li>
                  <li>Testing (Jest, React Testing Library)</li>
                  <li>Agile Methodology</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Education & Experience */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-gray-200">
            Education & Experience
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Experience Item */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Full Stack Developer</h3>
                <span className="text-gray-500 dark:text-gray-400">2022 - Present</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 mb-4">ABC Tech Solutions</p>
              <p className="text-gray-600 dark:text-gray-400">
                Developed and maintained full-stack web applications using React, Node.js, and MongoDB.
                Collaborated with design and product teams to implement new features and improve user experience.
              </p>
            </div>
            
            {/* Education Item */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Bachelor of Science in Computer Science</h3>
                <span className="text-gray-500 dark:text-gray-400">2018 - 2022</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 mb-4">University of Technology</p>
              <p className="text-gray-600 dark:text-gray-400">
                Graduated with honors. Specialized in Web Development and Software Engineering.
                Completed several project-based courses focused on full-stack development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 