#!/usr/bin/env node

// Set environment to production before importing anything
process.env.NODE_ENV = 'production';

console.log('Starting ShareSmallBiz in production mode...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');

// Import and start the server
import('./dist/index.js').catch((error) => {
  console.error('Failed to start production server:', error);
  process.exit(1);
});