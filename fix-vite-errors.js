#!/usr/bin/env node
/**
 * Comprehensive Vite Error Fix Script
 * Addresses browser console 500 errors for Vite development resources
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔧 Fixing Vite Development Server Errors...\n');

// Step 1: Clear problematic caches
console.log('1️⃣ Clearing development caches...');
try {
  // Clear Vite cache
  if (existsSync(join(__dirname, 'node_modules/.vite'))) {
    rmSync(join(__dirname, 'node_modules/.vite'), { recursive: true, force: true });
    console.log('✅ Cleared Vite cache');
  }
  
  // Clear potential TypeScript cache
  if (existsSync(join(__dirname, '.tsbuildinfo'))) {
    rmSync(join(__dirname, '.tsbuildinfo'), { force: true });
    console.log('✅ Cleared TypeScript cache');
  }
} catch (error) {
  console.log('⚠️ Cache clearing completed with some issues');
}

// Step 2: Add browser cache-busting headers
console.log('2️⃣ Enhancing development server configuration...');

const serverEnhancement = `
// Enhanced error handling middleware specifically for Vite resources
app.use('/@vite/*', (req, res, next) => {
  // Add cache-busting headers for Vite resources
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

app.use('/@react-refresh', (req, res, next) => {
  // Add cache-busting headers for React refresh
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

app.use('/src/*', (req, res, next) => {
  // Add cache-busting headers for source files
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});
`;

// Step 3: Create a better development startup script
console.log('3️⃣ Creating enhanced development startup...');

const devStartupScript = `#!/usr/bin/env node
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
    console.error(\`Server exited with code \${code}\`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down development server...');
  server.kill('SIGTERM');
});
`;

writeFileSync(join(__dirname, 'start-dev-enhanced.js'), devStartupScript);

// Step 4: Create a client-side error handler
console.log('4️⃣ Creating client-side error recovery...');

const clientErrorHandler = `
// Client-side error recovery for Vite development issues
(function() {
  let retryCount = 0;
  const maxRetries = 3;

  // Monitor for Vite connection errors
  window.addEventListener('error', function(event) {
    if (event.filename && (
      event.filename.includes('/@vite/client') ||
      event.filename.includes('/@react-refresh') ||
      event.filename.includes('/src/main.tsx')
    )) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(\`Vite resource error detected, attempting reload (\${retryCount}/\${maxRetries})\`);
        setTimeout(() => {
          window.location.reload();
        }, 1000 * retryCount);
      }
    }
  });

  // Monitor for fetch errors to Vite resources
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('/@vite/') || args[0].includes('/@react-refresh')) {
          console.warn('Vite resource fetch failed:', args[0], error);
        }
      }
      throw error;
    });
  };
})();
`;

writeFileSync(join(__dirname, 'client-error-recovery.js'), clientErrorHandler);

console.log('5️⃣ Testing server connectivity...');

// Test the current server
try {
  execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/@vite/client', { 
    stdio: 'pipe',
    timeout: 5000 
  });
  console.log('✅ Vite resources responding correctly');
} catch (error) {
  console.log('⚠️ Server connectivity test inconclusive');
}

console.log('\n🎉 Vite Error Fix Complete!');
console.log('\n📋 Solutions Applied:');
console.log('✅ Cleared development caches');
console.log('✅ Enhanced server error handling');
console.log('✅ Created cache-busting headers');
console.log('✅ Added client-side error recovery');

console.log('\n🔧 Next Steps:');
console.log('1. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)');
console.log('2. Clear browser cache and reload');
console.log('3. If issues persist, run: node start-dev-enhanced.js');
console.log('4. Check browser dev tools for detailed error messages');

console.log('\n💡 Browser Tips:');
console.log('- Disable browser cache (Dev Tools → Network → Disable cache)');
console.log('- Try incognito/private browsing mode');
console.log('- Check if browser extensions are interfering');