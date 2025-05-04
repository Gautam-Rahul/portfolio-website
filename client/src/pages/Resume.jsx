import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Loader from '../components/Loader';
import api from '../utils/api';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const fileRef = useRef(null);
  
  // Fetch resume URL
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/resume/active');
        
        if (data.success) {
          setResumeUrl(`${API_URL}${data.resume.path}`);
        } else {
          setError('No resume found.');
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResume();
  }, []);
  
  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  // Navigate to previous page
  const goToPrevPage = () => {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  };
  
  // Navigate to next page
  const goToNextPage = () => {
    setPageNumber(pageNumber >= numPages ? numPages : pageNumber + 1);
  };
  
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
          My Resume
        </h1>
        <p className="text-xl text-center mb-8 text-gray-600 dark:text-gray-400">
          Check out my experience and skills
        </p>
        
        {/* Download Button */}
        <div className="flex justify-center mb-6">
          <a
            href={resumeUrl}
            download="Rahul_Gautam_Resume.pdf"
            className="btn btn-primary px-6 py-3 rounded-full flex items-center gap-2"
          >
            <FaDownload /> Download Resume
          </a>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <Document
              file={resumeUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Loader />}
              error={<p className="text-red-500">Failed to load PDF document.</p>}
              className="flex justify-center"
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </Document>
          </div>
          
          {/* Page Navigation */}
          {numPages && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pageNumber <= 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40'
                }`}
                aria-label="Previous page"
              >
                <FaArrowLeft />
              </button>
              
              <p className="text-gray-700 dark:text-gray-300">
                Page {pageNumber} of {numPages}
              </p>
              
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pageNumber >= numPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40'
                }`}
                aria-label="Next page"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume; 