
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
        console.log(`Vite resource error detected, attempting reload (${retryCount}/${maxRetries})`);
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
