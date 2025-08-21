import { Spin } from 'antd'
import { lazy, Suspense } from 'react'

// Spine 컨테이너를 동적으로 로딩
const SpineContainer = lazy(() =>
  import('@/features/poc_spine/components/SpineContainer').then(module => ({
    default: module.SpineContainer,
  }))
)

interface LazySpineContainerProps {
  onSpineReady?: (spineBoy: any, isReady: boolean) => void
}

export const LazySpineContainer = ({
  onSpineReady,
}: LazySpineContainerProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Spin size="large" tip="Spine 애니메이션 로딩 중..." />
        </div>
      }
    >
      <SpineContainer onSpineReady={onSpineReady} />
    </Suspense>
  )
}
