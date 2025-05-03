import React, { useEffect, useRef, useState } from 'react';

/**
 * GameEmbed component that handles embedding games from itch.io
 * Uses multiple fallback strategies to handle CSP restrictions
 */
const GameEmbed = ({ gameUrl, title, link }) => {
  const containerRef = useRef(null);
  const [loadingState, setLoadingState] = useState('loading');
  const [fallbackMode, setFallbackMode] = useState(false);

  // Try multiple embedding strategies to bypass CSP restrictions
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing content
    containerRef.current.innerHTML = '';
    setLoadingState('loading');
    
    // First attempt: Try using a dynamic iframe with srcdoc attribute
    const tryEmbedGame = () => {
      try {
        // Create a wrapper div for better styling control
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        
        // Create iframe element with srcdoc attribute (can bypass some CSP restrictions)
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        
        // Set sandbox attributes to allow necessary features but maintain security
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
        
        // Use srcdoc to create a minimal HTML document that redirects to the game URL
        iframe.srcdoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                iframe { width: 100%; height: 100%; border: 0; }
              </style>
            </head>
            <body>
              <iframe src="${gameUrl}" frameborder="0" allowfullscreen></iframe>
            </body>
          </html>
        `;
        
        // Add event listeners to detect loading state
        iframe.onload = () => setLoadingState('loaded');
        iframe.onerror = () => {
          console.error('Failed to load game embed with srcdoc method');
          setFallbackMode(true);
        };
        
        wrapper.appendChild(iframe);
        containerRef.current.appendChild(wrapper);
      } catch (error) {
        console.error('Error creating game embed:', error);
        setFallbackMode(true);
      }
    };
    
    // Second attempt: Direct link if embedding fails
    const showFallbackLink = () => {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'flex flex-col items-center justify-center h-full bg-gray-800 p-6 text-center';
      
      const message = document.createElement('p');
      message.className = 'text-gray-300 mb-4';
      message.textContent = 'Unable to embed the game due to browser security restrictions.';
      
      const linkButton = document.createElement('a');
      linkButton.href = link;
      linkButton.target = '_blank';
      linkButton.rel = 'noopener noreferrer';
      linkButton.className = 'px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg';
      linkButton.textContent = `Play ${title} on itch.io`;
      
      fallbackDiv.appendChild(message);
      fallbackDiv.appendChild(linkButton);
      
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(fallbackDiv);
      setLoadingState('fallback');
    };
    
    // Start with the first approach
    tryEmbedGame();
    
    // If fallback mode is triggered, show the fallback link
    if (fallbackMode) {
      showFallbackLink();
    }
    
    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [gameUrl, title, link, fallbackMode]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-900 flex items-center justify-center"
    >
      {loadingState === 'loading' && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      )}
    </div>
  );
};

export default GameEmbed;
