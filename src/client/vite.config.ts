import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {join as pJoin} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: pJoin(__dirname, "../../dist/client"),
    emptyOutDir: true,
    minify: "terser"
  },
  base: ""
})
