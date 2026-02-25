import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import { nitro } from 'nitro/vite'

const forSites = process.env?.FOR_SITES === 'true'

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    forSites && nitro(),
    devtoolsJson(),
    viteReact(),
  ],
  server: {
    host: '::',
    allowedHosts: true,
    hmr: true,
  },
  nitro: {
    preset: 'node_server',
  },
})

export default config
