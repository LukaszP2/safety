import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Output to www/ directory which is served at /local/ in Home Assistant
    outDir: '../www',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/safety-panel.js'),
      name: 'SafetyPanel',
      formats: ['es'],
      fileName: () => 'safety-panel.js'
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});