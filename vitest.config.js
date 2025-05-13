import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
    globals: true,
    bail: 1, // Exit on first test failure
    watch: false,
  },
});