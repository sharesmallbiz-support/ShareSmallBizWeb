import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Script to fix asset paths for GitHub Pages deployment
const indexPath = resolve('../publish/web-static/index.html');
const debugPath = resolve('../publish/web-static/debug.html');

console.log('🔧 Fixing asset paths for GitHub Pages...');

try {
  // Fix index.html
  let indexContent = readFileSync(indexPath, 'utf-8');
  
  // Replace relative paths with GitHub Pages paths
  indexContent = indexContent
    .replace(/src="\.\/assets\//g, 'src="/ShareSmallBizWeb/assets/')
    .replace(/href="\.\/assets\//g, 'href="/ShareSmallBizWeb/assets/');
  
  writeFileSync(indexPath, indexContent);
  console.log('✅ Fixed index.html paths');
  
  // Fix debug.html if it exists
  try {
    let debugContent = readFileSync(debugPath, 'utf-8');
    debugContent = debugContent
      .replace(/src="\.\/assets\//g, 'src="/ShareSmallBizWeb/assets/')
      .replace(/href="\.\/assets\//g, 'href="/ShareSmallBizWeb/assets/');
    
    writeFileSync(debugPath, debugContent);
    console.log('✅ Fixed debug.html paths');
  } catch (e) {
    console.log('ℹ️  debug.html not found, skipping');
  }
  
  console.log('🚀 GitHub Pages paths are ready!');
} catch (error) {
  console.error('❌ Error fixing paths:', error);
  process.exit(1);
}
