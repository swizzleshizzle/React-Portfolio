import { useState } from 'react'
import './App.css'

import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App () {
  return (
    
<BrowserRouter>
  <div id="backgroundViz">
    
    <MainContent />
    <Footer />
  </div>
  </BrowserRouter>
  

  );
}

//export default App
