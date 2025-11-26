import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/main.tsx'),
			name: 'Bookmarklet',
			fileName: 'bookmarklet',
			formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: 'esbuild',
    outDir: 'dist',
  },
})