import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    devtoolsJson(),
    viteReact(),
  ],
  optimizeDeps: {
    // Pre-bundle common dependencies for faster cold starts
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tanstack/react-router',
      '@tanstack/react-query',
    ],
  },
  build: {
    sourcemap: false, // Disable sourcemaps in dev for speed
  },
  ssr: {
    noExternal: ['@tanstack/react-router', '@tanstack/react-start'],
  },
  server: {
    host: '::',
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR === 'true' ? false : true,
    // Increase warmup to pre-transform more modules
    warmup: {
      clientFiles: ['./src/router.tsx', './src/routes/**/*.tsx'],
    },
  },
})

export default config
