import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: 'src/dts/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        {
          '@iconify/vue': ['Icon']
        }
      ]
      // eslintrc: {
      //   enabled: true
      // }
    }),
    VueI18nPlugin({
      include: [fileURLToPath(new URL('./src/locales/**.json', import.meta.url))],
      strictMessage: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
        // 如果后端没有 /api 前缀,可以取消下面这行的注释来重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
