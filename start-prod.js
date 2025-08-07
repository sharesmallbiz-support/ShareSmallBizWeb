#!/usr/bin/env node

// Set environment to production before importing anything
process.env.NODE_ENV = 'production';

console.log('Starting ShareSmallBiz in production mode...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');
console.log('Current working directory:', process.cwd());

// Check if build directory exists
import fs from 'fs';
import path from 'path';

const distPath = path.resolve(process.cwd(), 'dist');
const publicPath = path.resolve(distPath, 'public');
const serverPath = path.resolve(distPath, 'index.js');

console.log('Checking build files...');
console.log('dist directory exists:', fs.existsSync(distPath));
console.log('server file exists:', fs.existsSync(serverPath));
console.log('public directory exists:', fs.existsSync(publicPath));

if (fs.existsSync(distPath)) {
  console.log('Dist directory contents:', fs.readdirSync(distPath));
}

if (fs.existsSync(publicPath)) {
  console.log('Public directory contents:', fs.readdirSync(publicPath));
}

// Validate build before starting
if (!fs.existsSync(serverPath)) {
  console.error('Server build not found at:', serverPath);
  console.error('Make sure to run "npm run build" first');
  process.exit(1);
}

if (!fs.existsSync(publicPath)) {
  console.error('Client build not found at:', publicPath);
  console.error('Make sure to run "npm run build" first');
  process.exit(1);
}

// Import and start the server
import('./dist/index.js').catch((error) => {
  console.error('Failed to start production server:', error);
  console.error('Make sure to run "npm run build" first');
  process.exit(1);
});