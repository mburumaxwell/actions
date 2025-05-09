import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/compute-docker-tags.ts',
    'src/current-date.ts',
    // add other independent scripts here
  ],
  outDir: 'dist',
  format: 'cjs',
  target: 'node20',
  platform: 'node',
  splitting: false,
  clean: true,
  dts: false,
  sourcemap: true,
  noExternal: [/./], // ⬅️ bundle everything
});
