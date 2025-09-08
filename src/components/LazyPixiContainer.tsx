import { Spin } from 'antd'
import { lazy, Suspense } from 'react'

// PixiJS 컨테이너를 동적으로 로딩
const MainApplication = lazy(() =>
  import('@/features/poc_spine/components/MainApplication').then(module => ({
    default: module.MainApplication,
  }))
)

export const LazyPixiContainer = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-96">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">PixiJS 그래픽 엔진 로딩 중...</p>
        </div>
      }
    >
      <MainApplication />
    </Suspense>
  )
}
