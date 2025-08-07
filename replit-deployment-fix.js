#!/usr/bin/env node
/**
 * Replit Deployment Fix Script
 * Forces production mode and proper static file serving
 */

console.log('🚀 Fixing Replit Deployment Configuration...\n');

// Force production environment
process.env.NODE_ENV = 'production';
process.env.REPLIT_DEPLOYMENT = '1';

console.log('Environment configured:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- REPLIT_DEPLOYMENT:', process.env.REPLIT_DEPLOYMENT);

// Import and start the production server
import('./dist/index.js').then(() => {
  console.log('✅ Production server started successfully');
}).catch(error => {
  console.error('❌ Failed to start production server:', error);
  console.error('Make sure you have run "npm run build" first');
  process.exit(1);
});