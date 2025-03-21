import React, { useEffect, useRef } from 'react';

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Add event listener to close modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener to close modal on ESC key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    // Add modal-open class to body for CSS targeting
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
      // Remove modal-open class when modal is closed
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ 
          transform: 'scale(1)',
          animation: 'modal-pop 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Project image */}
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-contain bg-gray-100 dark:bg-gray-900"
          />
        </div>

        {/* Project content */}
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {project.title}
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-400 whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          <div className="mb-6 justify-between items-center relative">
            <h3 className="text-lg justify-center font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Technologies
            </h3>
            <div className="flex justify-center flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full  text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 mb-8">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white-100 hover:bg-purple-200 text-white font-medium rounded-lg transition-colors"
            >
              View Project
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
