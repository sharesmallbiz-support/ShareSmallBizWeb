import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const httpServer = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error("Express error handler triggered:", {
      url: req.originalUrl,
      method: req.method,
      message: err.message,
      stack: err.stack,
      status: status,
      userAgent: req.get('User-Agent')?.substring(0, 50)
    });
    
    if (res.headersSent) {
      return _next(err);
    }
    
    res.status(status).json({ 
      message, 
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("Current NODE_ENV:", process.env.NODE_ENV);
  console.log("Environment check - is development?", process.env.NODE_ENV === "development");
  console.log("Environment check - no NODE_ENV?", !process.env.NODE_ENV);
  
    if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
      console.log("Setting up Vite development mode");
      await setupVite(app, httpServer);
    } else {
      console.log("Setting up static file serving for production");
      console.log("Production mode detected, serving static files");
      
      // Add production-specific error handling with better logging
      try {
        console.log("Checking dist/public directory...");
        const distPath = path.resolve(import.meta.dirname, "../dist/public");
        console.log("Looking for static files at:", distPath);
        
        if (!fs.existsSync(distPath)) {
          console.error("❌ Build files not found. Please run 'npm run build' first");
          console.log("Expected path:", distPath);
          throw new Error(`Build directory not found: ${distPath}`);
        }
        
        serveStatic(app);
        console.log("✅ Static file serving configured");
      } catch (error) {
        console.error("❌ Failed to setup static file serving:", error);
        throw error as Error;
      }
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "5000", 10);
    
    await new Promise((resolve, reject) => {
      httpServer.listen(
        {
          port,
          host: "0.0.0.0",
        },
        () => {
          log(`serving on port ${port}`);
          resolve(httpServer);
        }
      );
      
      httpServer.on('error', (error) => {
        console.error('Server error:', error);
        reject(error);
      });
    });
    
    console.log("✅ Server setup complete and listening");
    
    // In production, keep the process alive
    if (process.env.NODE_ENV === "production") {
      process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
      });
      
      process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', (error as Error).stack);
    process.exit(1);
  }
})();
