import 'antd/dist/reset.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { PreloadResources } from './components/PreloadResources'
import './index.css'
import { performanceMonitor } from './utils/performanceMonitor'

// 성능 모니터링 시작
performanceMonitor.startMeasure('app-initialization')
performanceMonitor.measureWebVitals()

// React 19 최적화된 렌더링
const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <PreloadResources />
    <App />
  </StrictMode>
)

// 앱 초기화 완료 측정
performanceMonitor.endMeasure('app-initialization')

// 성능 경고 체크 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    const warnings = performanceMonitor.checkPerformanceWarnings()
    if (warnings.length > 0) {
      console.warn('🚨 성능 개선 필요:', warnings)
    } else {
      console.log('✅ 성능 상태 양호')
    }
  }, 3000)
}
