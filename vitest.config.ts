import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': resolve(__dirname, 'src/domain'),
      '@application': resolve(__dirname, 'src/application'),
      '@infrastructure': resolve(__dirname, 'src/infrastructure'),
      '@presentation': resolve(__dirname, 'src/presentation'),
      '@config': resolve(__dirname, 'src/config'),
      '@common': resolve(__dirname, 'src/common'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    root: './',
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
  plugins: [swc.vite({ module: { type: 'nodenext' } })],
});
