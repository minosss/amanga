import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/cli.ts'],
  format: [
    'cjs',
    'esm',
  ],
  clean: true,
  dts: false,
});
