import AppRoutes from '@/routes'
import { Spin } from 'antd'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'

// React 19 최적화된 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Spin size="large" />
      <p className="mt-4 text-gray-600">애플리케이션 로딩 중...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Router>
          <AppRoutes />
        </Router>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
