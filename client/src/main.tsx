import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error handling for debugging
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  console.log("Starting React app...");
  console.log("VITE_MODE:", import.meta.env.VITE_MODE);
  console.log("Current URL:", window.location.href);
  
  const root = createRoot(rootElement);
  root.render(<App />);
  
  console.log("React app rendered successfully");
} catch (error) {
  console.error("Failed to render React app:", error);
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
        <h2>App Loading Error</h2>
        <p>Failed to load the React application.</p>
        <p>Error: ${errorMessage}</p>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}
