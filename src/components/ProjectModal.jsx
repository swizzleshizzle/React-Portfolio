import React, { useEffect, useRef, useState } from 'react';

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false); // Manually paused by user
  const [direction, setDirection] = useState('right'); // 'left' or 'right' to control animation direction
  const [isAnimating, setIsAnimating] = useState(false); // Track if animation is in progress
  
  // Convert single image to array if needed
  const images = Array.isArray(project?.images) ? project.images : project?.image ? [project.image] : [];
  
  // Auto-cycle through images every 5 seconds
  useEffect(() => {
    // Only set up interval if there are multiple images and auto-cycling is not paused by user
    if (images.length > 1 && !isAutoPaused) {
      const interval = setInterval(() => {
        // Use the 'right' direction for auto-cycling
        setDirection('right');
        setIsAnimating(true);
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        setTimeout(() => setIsAnimating(false), 700); // Match with animation duration
      }, 5000); // 5 seconds
      
      return () => clearInterval(interval); // Clean up on unmount or when dependencies change
    }
  }, [images, isAutoPaused]);
  
  // Function to handle manual navigation
  const handleManualNavigation = (index, navigateDirection) => {
    // Set direction based on navigation (for animation purposes)
    setDirection(navigateDirection || (index > currentImageIndex ? 'right' : 'left'));
    
    // Trigger animation state
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 700); // Match this with the animation duration
    
    // Update the current image index
    setCurrentImageIndex(index);
  };
  
  // Toggle play/pause for the auto-cycling
  const toggleAutoPlay = () => {
    setIsAutoPaused(prevState => !prevState);
  };

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
        className="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ 
          transform: 'scale(1)',
          animation: 'modal-pop 0.3s ease-out'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 z-[50]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Project image carousel */}
        <div className="w-full h-64 md:h-80 relative bg-gray-100 dark:bg-gray-900">
          {/* Carousel container */}
          <div className="absolute inset-0 w-full h-full">
            {/* Images container */}
            {images.length > 0 && images.map((image, index) => (
              <div 
                key={index}
                className={`absolute inset-0 flex items-center justify-center w-full h-full transform transition-all duration-700 ease-in-out ${index === currentImageIndex 
                  ? 'opacity-100 translate-x-0 scale-100 z-[5]' 
                  : direction === 'left' && index > currentImageIndex 
                    ? 'opacity-0 translate-x-full scale-95 z-0' 
                    : direction === 'left' && index < currentImageIndex 
                    ? 'opacity-0 -translate-x-full scale-95 z-0' 
                    : direction === 'right' && index < currentImageIndex 
                    ? 'opacity-0 -translate-x-full scale-95 z-0' 
                    : 'opacity-0 translate-x-full scale-95 z-0'
                } ${isAnimating ? 'transition-all duration-700 ease-in-out' : ''}`}
              >
                <img 
                  src={image} 
                  alt={`${project.title} - image ${index + 1} of ${images.length}`}
                  className="max-w-full max-h-full object-contain shadow-lg rounded-sm transform transition-transform duration-500 pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))'
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Carousel controls - separate layer with higher z-index */}
          <div className="absolute inset-0 z-[15]">
            {/* Only show navigation if multiple images */}
            {images.length > 1 && (
              <>
                {/* Previous button */}
                <button
                  onClick={() => {
                    handleManualNavigation(
                      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1,
                      'left'
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-700 bg-opacity-80 hover:bg-purple-800 hover:scale-110 text-white p-3 rounded-full focus:outline-none transition-all duration-200 shadow-xl cursor-pointer"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Next button */}
                <button
                  onClick={() => {
                    handleManualNavigation(
                      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1,
                      'right'
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-700 bg-opacity-80 hover:bg-purple-800 hover:scale-110 text-white p-3 rounded-full focus:outline-none transition-all duration-200 shadow-xl cursor-pointer"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 px-4 py-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Determine direction based on index difference
                        const dir = index > currentImageIndex ? 'right' : 'left';
                        handleManualNavigation(index, dir);
                      }}
                      className={`h-3 w-3 rounded-full focus:outline-none transition-all duration-300 transform cursor-pointer ${index === currentImageIndex 
                        ? 'bg-purple-500 scale-125 shadow-lg' 
                        : 'bg-gray-300 bg-opacity-80 hover:bg-purple-300 hover:scale-110'}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Play/Pause button */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute bottom-4 right-4 bg-purple-700 bg-opacity-80 hover:bg-purple-800 text-white p-2 rounded-full focus:outline-none transition-all duration-200 shadow-lg cursor-pointer"
                  aria-label={isAutoPaused ? 'Play slideshow' : 'Pause slideshow'}
                >
                  {isAutoPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project content */}
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {project.title}
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Description
            </h3>
            <p className="text-gray-400 whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          <div className="mb-6 justify-between items-center relative">
            <h3 className="text-lg justify-center font-semibold text-gray-200 mb-2">
              Technologies
            </h3>
            <div className="flex justify-center flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-700 dark:bg-gray-700 rounded-full  text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 mb-8 gap-4">
            {project.githubLink && (
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg"
              >
                View Source Code
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </a>
            )}
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg visited"
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
