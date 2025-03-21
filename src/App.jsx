import { useState, useEffect } from 'react'
import './App.css'

import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import HeroThree from './components/HeroThree';
import TradingViewWidget from './components/TVEmbed';

export default function App() {
  // Apply smooth scrolling to the document
  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    
    return () => {
      document.documentElement.classList.remove('scroll-smooth');
    };
  }, []);

  // For debugging - to see if THREE.js loads directly
  const [showDebug, setShowDebug] = useState(false);

  return (
    <BrowserRouter>
      <div id="backgroundViz" className="min-h-screen">
        
        {showDebug ? (
          <div style={{ height: '100vh', width: '100%' }}>
            <HeroThree />
          </div>
        ) : (
          <><MainContent /></>

        )}
        
      </div>
    </BrowserRouter>
  );
}
