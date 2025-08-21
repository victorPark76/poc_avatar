import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// HTTP/2 및 서버 최적화 설정
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    open: true,
    // HTTP/2 지원 (HTTPS 필요)
    https: {
      // 개발용 자체 서명 인증서 생성
      // 실제 배포 시에는 유효한 SSL 인증서 사용
    },
    // 압축 설정
    compress: true,
    // 캐시 설정
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
    // CORS 설정
    cors: true,
    // HMR 최적화
    hmr: {
      overlay: true,
    },
  },
  // 빌드 최적화
  build: {
    // 청크 크기 최적화
    chunkSizeWarningLimit: 1000,
    // 압축 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 롤업 옵션
    rollupOptions: {
      output: {
        // 청크 분할
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['antd', '@ant-design/icons'],
          graphics: ['pixi.js', '@pixi/react'],
        },
      },
    },
  },
})
