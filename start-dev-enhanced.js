#!/usr/bin/env node
// Enhanced Development Startup Script
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🚀 Starting Enhanced Development Server...');

// Clear any existing processes
try {
  require('child_process').execSync('pkill -f "tsx server" || true', { stdio: 'ignore' });
  await setTimeout(1000);
} catch (e) {
  // Ignore cleanup errors
}

// Set optimal environment
process.env.NODE_ENV = 'development';
process.env.VITE_DEV_SERVER_HMRPORT = '24678'; // Use a specific HMR port

// Start the server with enhanced error handling
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    FORCE_COLOR: '1'
  }
});

server.on('error', (error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down development server...');
  server.kill('SIGTERM');
});
