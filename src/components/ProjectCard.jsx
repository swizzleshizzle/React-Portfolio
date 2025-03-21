import React, { useState, useRef } from 'react';
import TiltCard from './TiltCard';

const ProjectCard = ({ project, onClick }) => {
  const { title, description, image, technologies, link } = project;
  
  return (
    <div className="h-full">
      <TiltCard>
        <div className="overflow-hidden h-full relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-contain" 
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            {/* Link buttons with high z-index to ensure they're clickable */}
            <div className="flex justify-between items-center mt-4 relative" style={{ zIndex: 30 }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(project);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors relative"
                style={{ zIndex: 30 }}
              >
                View Details
              </button>
              
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors relative"
                style={{ zIndex: 30 }}
              >
                Visit Project
              </a>
            </div>
          </div>
          
          {/* Invisible overlay for card click that doesn't block buttons */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => onClick(project)}
            style={{ zIndex: 20 }}
          />
        </div>
      </TiltCard>
    </div>
  );
};

export default ProjectCard;
