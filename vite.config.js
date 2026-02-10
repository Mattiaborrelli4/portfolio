import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      'sectile-marica-uneminently.ngrok-free.dev',
      '.ngrok-free.dev'
    ]
  }
});
