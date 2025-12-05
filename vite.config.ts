import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
	],
	define: {
		'process.env.NODE_ENV': "'production'",
	},
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
});
