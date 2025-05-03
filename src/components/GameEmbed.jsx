import React, { useEffect, useRef } from 'react';

/**
 * GameEmbed component that handles embedding games from itch.io
 * Uses a ref-based approach to create the iframe after component mount
 * This can help bypass some CSP restrictions
 */
const GameEmbed = ({ gameUrl, title, link }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create iframe element
      const iframe = document.createElement('iframe');
      iframe.src = gameUrl;
      iframe.title = title;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      
      // Add fallback content
      const fallbackLink = document.createElement('a');
      fallbackLink.href = link;
      fallbackLink.textContent = `Play ${title} on itch.io`;
      iframe.appendChild(fallbackLink);
      
      // Append to container
      containerRef.current.appendChild(iframe);
    }
  }, [gameUrl, title, link]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-900 flex items-center justify-center"
    >
      <p className="text-gray-400">Loading game...</p>
    </div>
  );
};

export default GameEmbed;
