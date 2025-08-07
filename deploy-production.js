#!/usr/bin/env node

// Comprehensive production deployment script
process.env.NODE_ENV = 'production';

console.log('🚀 ShareSmallBiz Production Deployment');
console.log('=====================================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');
console.log('Current directory:', process.cwd());
console.log('');

import fs from 'fs';
import path from 'path';

// Validate build artifacts
const validationChecks = [
  { path: 'dist', description: 'Build output directory' },
  { path: 'dist/index.js', description: 'Server bundle' },
  { path: 'dist/public', description: 'Client build directory' },
  { path: 'dist/public/index.html', description: 'Client HTML file' },
  { path: 'dist/public/assets', description: 'Client assets directory' }
];

console.log('🔍 Validating build artifacts...');
let validationFailed = false;

for (const check of validationChecks) {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${check.description}: ${check.path}`);
  
  if (!exists) {
    validationFailed = true;
  }
}

if (validationFailed) {
  console.log('');
  console.error('❌ Build validation failed. Run "npm run build" first.');
  process.exit(1);
}

console.log('');
console.log('✅ Build validation passed');
console.log('');

// Set up error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM - shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT - shutting down gracefully');
  process.exit(0);
});

// Start the server
console.log('🚀 Starting production server...');

try {
  // Import the server - this will execute the server startup
  await import('./dist/index.js');
  console.log('');
  console.log('✅ Server started successfully in production mode');
  console.log('🌐 Application is ready to serve requests');
  console.log('');
  
} catch (error) {
  console.log('');
  console.error('❌ Failed to start production server');
  console.error('Error:', error.message);
  
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  // Specific error guidance
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('');
    console.error('💡 Suggestion: Run "npm run build" to create the production build');
  } else if (error.code === 'EADDRINUSE') {
    console.error('');
    console.error('💡 Suggestion: Port is already in use. Set a different PORT environment variable');
  } else if (error.message.includes('static')) {
    console.error('');
    console.error('💡 Suggestion: Static files missing. Check if client build completed successfully');
  }
  
  process.exit(1);
}