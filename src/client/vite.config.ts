import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join as pJoin, resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: pJoin(__dirname, '../../dist/client'),
		emptyOutDir: true,
		minify: 'terser',
	},
	base: '',
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'!': resolve(__dirname, './src/assets'),
		},
	},
});
