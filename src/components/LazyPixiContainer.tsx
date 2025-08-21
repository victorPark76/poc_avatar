import { Spin } from 'antd'
import { lazy, Suspense } from 'react'

// PixiJS 컨테이너를 동적으로 로딩
const MainContainer = lazy(() =>
  import('@/features/poc_spine/components/MainApplication').then(module => ({
    default: module.MainContainer,
  }))
)

export const LazyPixiContainer = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Spin size="large" tip="PixiJS 그래픽 엔진 로딩 중..." />
        </div>
      }
    >
      <MainContainer />
    </Suspense>
  )
}
