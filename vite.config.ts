import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',  // Changed from URL to IP
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [
      'immersivedigitaldevelopment.com',
      'www.immersivedigitaldevelopment.com'
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));