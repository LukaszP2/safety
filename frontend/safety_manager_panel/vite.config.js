import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Teraz plik wyląduje w: custom_components/safety/www/
    outDir: '../../www', 
    emptyOutDir: false, 
    rollupOptions: {
      input: 'src/safety-panel.js', 
      output: {
        entryFileNames: 'safety-panel.js',
        assetFileNames: 'safety-panel.[ext]',
        format: 'es',
      }
    }
  }
});