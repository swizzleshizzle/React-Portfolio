import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable right-click context menu on Three.js elements
document.addEventListener('contextmenu', (e) => {
  // Check if the target is a canvas or within the word cloud container
  const isCanvas = e.target.tagName.toLowerCase() === 'canvas';
  const isWordCloud = e.target.closest('.word-cloud-container');
  
  if (isCanvas || isWordCloud) {
    e.preventDefault();
    return false;
  }
}, false);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
