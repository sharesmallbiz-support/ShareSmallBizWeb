#!/usr/bin/env node

// Set environment to production before importing anything
process.env.NODE_ENV = 'production';

console.log('Starting ShareSmallBiz in production mode...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');

// Check if build directory exists
import fs from 'fs';
import path from 'path';

const distPath = path.resolve(process.cwd(), 'dist');
const publicPath = path.resolve(distPath, 'public');

console.log('Checking build files...');
console.log('dist directory exists:', fs.existsSync(distPath));
console.log('public directory exists:', fs.existsSync(publicPath));

if (fs.existsSync(publicPath)) {
  console.log('Public directory contents:', fs.readdirSync(publicPath));
}

// Import and start the server
import('./dist/index.js').catch((error) => {
  console.error('Failed to start production server:', error);
  console.error('Make sure to run "npm run build" first');
  process.exit(1);
});