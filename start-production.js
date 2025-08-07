#!/usr/bin/env node
// Production Startup Script
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log('🚀 Starting ShareSmallBiz in Production Mode');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Import and start the server
import('./dist/index.js').catch(error => {
  console.error('❌ Failed to start production server:', error);
  process.exit(1);
});
