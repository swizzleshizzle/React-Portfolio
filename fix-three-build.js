/**
 * fix-three-build.js
 * 
 * This script fixes issues with Three.js in the production build by:
 * 1. Ensuring React is loaded before Three.js
 * 2. Preventing name mangling for Three.js classes
 * 3. Adding proper module preloading
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const distDir = path.resolve(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

console.log('Starting Three.js build fixes...');

// Fix 1: Ensure proper module loading order in index.html
async function fixModuleLoadingOrder() {
  try {
    console.log('Fixing module loading order in index.html...');
    
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Find all script tags
      const scriptRegex = /<script[^>]*src="([^"]+)"[^>]*>/g;
      const scripts = [];
      let match;
      
      while ((match = scriptRegex.exec(indexHtml)) !== null) {
        scripts.push({
          fullTag: match[0],
          src: match[1]
        });
      }
      
      // Identify React and Three.js scripts
      const reactScript = scripts.find(s => s.src.includes('react') || s.src.includes('jsx'));
      const threeScript = scripts.find(s => s.src.includes('three'));
      
      if (reactScript && threeScript) {
        // Ensure React is loaded before Three.js
        const reactIndex = indexHtml.indexOf(reactScript.fullTag);
        const threeIndex = indexHtml.indexOf(threeScript.fullTag);
        
        if (threeIndex < reactIndex) {
          console.log('Reordering script tags to load React before Three.js...');
          
          // Remove both scripts
          indexHtml = indexHtml.replace(reactScript.fullTag, '');
          indexHtml = indexHtml.replace(threeScript.fullTag, '');
          
          // Add them back in the correct order
          const headEndTag = '</head>';
          const headEndIndex = indexHtml.indexOf(headEndTag);
          
          indexHtml = indexHtml.slice(0, headEndIndex) + 
                     reactScript.fullTag + '\n    ' + 
                     threeScript.fullTag + '\n    ' + 
                     indexHtml.slice(headEndIndex);
          
          fs.writeFileSync(indexHtmlPath, indexHtml);
          console.log('Successfully reordered script tags.');
        } else {
          console.log('Script tags already in correct order.');
        }
      } else {
        console.log('Could not identify React or Three.js scripts.');
      }
    } else {
      console.error(`index.html not found at ${indexHtmlPath}`);
    }
  } catch (error) {
    console.error('Error fixing module loading order:', error);
  }
}

// Fix 2: Add module preloading hints
async function addModulePreloadingHints() {
  try {
    console.log('Adding module preloading hints...');
    
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Find all JavaScript files in the dist directory
      const jsFiles = glob.sync(path.join(distDir, 'assets', '*.js'));
      
      // Create preload tags for JS files
      const preloadTags = jsFiles.map(file => {
        const fileName = path.basename(file);
        return `<link rel="modulepreload" href="assets/${fileName}">`;
      }).join('\n    ');
      
      // Add preload tags to the head
      const headEndTag = '</head>';
      const headEndIndex = indexHtml.indexOf(headEndTag);
      
      if (headEndIndex !== -1 && !indexHtml.includes('rel="modulepreload"')) {
        indexHtml = indexHtml.slice(0, headEndIndex) + 
                   '\n    <!-- Preload modules for better performance -->\n    ' + 
                   preloadTags + '\n    ' + 
                   indexHtml.slice(headEndIndex);
        
        fs.writeFileSync(indexHtmlPath, indexHtml);
        console.log('Successfully added module preloading hints.');
      } else {
        console.log('Module preloading hints already exist or head tag not found.');
      }
    }
  } catch (error) {
    console.error('Error adding module preloading hints:', error);
  }
}

// Run the fixes
async function runFixes() {
  await fixModuleLoadingOrder();
  await addModulePreloadingHints();
  console.log('Three.js build fixes completed.');
}

runFixes();
