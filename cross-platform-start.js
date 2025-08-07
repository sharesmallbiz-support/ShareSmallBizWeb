#!/usr/bin/env node

/**
 * Cross-platform production starter for ShareSmallBiz
 * Handles Windows/Linux environment variable differences
 */

// Force production environment
process.env.NODE_ENV = 'production';

console.log('🚀 ShareSmallBiz Production Server');
console.log('===================================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');
console.log('Platform:', process.platform);

// Check if we're in the right directory
import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'dist/index.js',
  'dist/public/index.html'
];

console.log('\n🔍 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.error(`❌ ${file} - Missing`);
    console.error('Run "npm run build" first!');
    process.exit(1);
  }
}

// Start the server
console.log('\n🎯 Starting production server...\n');
import('./dist/index.js').catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error('💡 Port is already in use. Stop other servers first.');
  }
  process.exit(1);
});