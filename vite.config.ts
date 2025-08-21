import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 19 features
      jsxImportSource: 'react',
      // 성능 최적화
      babel: {
        plugins: [
          // React 19 최적화
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
    // 번들 분석기 (개발 시에만)
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'dist/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  server: {
    port: 3002,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    // CommonJS 모듈 해결
    dedupe: [],
  },
  // 성능 최적화된 빌드 설정
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        // 청크 분할 최적화
        manualChunks: {
          // React 관련
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI 라이브러리들
          'ui-vendor': ['antd', '@ant-design/icons'],
          'mui-vendor': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],

          // 그래픽 라이브러리들 (가장 무거운 것들)
          'graphics-vendor': ['pixi.js', '@pixi/react', 'pixi-viewport'],
          'spine-vendor': ['@esotericsoftware/spine-pixi-v8'],

          // 폼 라이브러리
          'forms-vendor': [
            '@jsonforms/core',
            '@jsonforms/react',
            '@jsonforms/material-renderers',
            '@jsonforms/vanilla-renderers',
          ],

          // 상태 관리
          'state-vendor': ['zustand'],
        },
        // 파일명 최적화
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      // 외부 의존성 최적화
      external: [],
    },
    // 청크 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
    // 소스맵 최적화 (프로덕션에서는 비활성화)
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  // CSS 최적화
  css: {
    devSourcemap: true,
  },
  // 의존성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'zustand',
      'pixi.js',
      '@pixi/react',
      'pixi-viewport',
    ],
    exclude: [
      // Spine 라이브러리만 동적 로딩
      '@esotericsoftware/spine-pixi-v8',
    ],
    // CommonJS 모듈 처리
    force: true,
  },
})
