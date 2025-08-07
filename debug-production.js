#!/usr/bin/env node

// Debug script for production deployment issues
process.env.NODE_ENV = 'production';
process.env.PORT = '5004';

console.log('🔍 Debug Production Server');
console.log('=========================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('Current directory:', process.cwd());

try {
  console.log('\n📦 Importing production server...');
  const serverModule = await import('./dist/index.js');
  console.log('✅ Server module imported successfully');
  
  // Keep the process alive for a few seconds
  setTimeout(() => {
    console.log('🔚 Debug complete - exiting');
    process.exit(0);
  }, 5000);
  
} catch (error) {
  console.error('❌ Failed to import/start server:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  process.exit(1);
}