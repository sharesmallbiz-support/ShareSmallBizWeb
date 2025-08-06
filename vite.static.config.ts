import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/static"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          utils: ["date-fns", "clsx", "tailwind-merge"],
        },
      },
    },
  },
  base: process.env.GITHUB_ACTIONS ? "/ShareSmallBizWeb/" : "./", // GitHub Pages base path
  define: {
    "process.env.VITE_MODE": '"static"',
  },
  publicDir: path.resolve(import.meta.dirname, "client/public"),
});
