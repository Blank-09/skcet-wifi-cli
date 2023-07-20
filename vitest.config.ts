import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // add index.js to the test files
    testTimeout: 30000,
  },
})
