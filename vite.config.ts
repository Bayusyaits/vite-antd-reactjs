import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default ({ mode }) => {
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    define: {
      'import.meta.env.NODE_ENV': `"${mode}"`,
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          relativeUrls: true,
          javascriptEnabled: true,
        },
      },
    },
    build: {
      target: 'es2015',
      outDir: 'build',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
          assetFileNames: `assets/[hash].[ext]`,
          chunkFileNames: `assets/[hash].js`,
        },
      },
    },
    envPrefix: 'REACT_APP_',
  });
};
