import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Cel: Główny folder www Home Assistanta
    outDir: '/home/ubuntu/iot/ha_config/www',
    
    // BARDZO WAŻNE: false, żeby Vite nie skasowało innych Twoich plików w folderze www!
    emptyOutDir: false, 
    
    rollupOptions: {
      // Tutaj wskaż swój główny plik wejściowy (zmień, jeśli nazywa się np. main.js)
      input: 'src/safety-panel.js', 
      
      output: {
        // Wymuszamy stałą nazwę pliku bez dziwnych doklejek (hashy)
        entryFileNames: 'safety-panel.js',
        assetFileNames: 'safety-panel.[ext]',
        format: 'es', // Format modułów (najlepszy dla Home Assistanta)
      }
    }
  }
});