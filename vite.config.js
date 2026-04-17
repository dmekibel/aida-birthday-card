export default {
  base: './',
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    target: 'es2020'
  }
};
