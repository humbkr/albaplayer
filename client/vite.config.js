import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['styled-components', { displayName: command === 'serve' }]],
      },
    }),
    tsconfigPaths(),
    svgr(),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
    port: 3001,
  },
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 50,
        statements: 50,
        branches: 50,
        functions: 50,
        autoUpdate: false,
      },
    },
    globals: true,
    environment: 'jsdom',
    mockReset: true,
    setupFiles: 'src/common/utils/testing/setupTests',
  },
}))
