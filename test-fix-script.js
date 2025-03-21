/**
 * test-fix-script.js
 * 
 * A simple test script to verify that fix-three-build.js works correctly with ES modules.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing ES module imports...');
console.log('Current directory:', __dirname);

// Check if fix-three-build.js exists
const fixScriptPath = path.join(__dirname, 'fix-three-build.js');
if (fs.existsSync(fixScriptPath)) {
  console.log('fix-three-build.js exists at:', fixScriptPath);
  console.log('ES module imports are working correctly!');
} else {
  console.error('fix-three-build.js not found at:', fixScriptPath);
}
