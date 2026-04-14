import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/nacc.js'),
      name: 'NACC',
      formats: ['iife'],
      fileName: () => 'nacc.js',
    },
    outDir: '.',
    emptyOutDir: false,
  },
});
