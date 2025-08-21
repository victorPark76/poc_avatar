import { useCallback, useTransition } from 'react'

// React 19 동시 기능을 활용한 최적화된 전환 훅
export const useOptimizedTransition = () => {
  const [isPending, startTransition] = useTransition()

  // 우선순위가 낮은 작업을 위한 전환
  const startLowPriorityTransition = useCallback(
    (callback: () => void) => {
      startTransition(() => {
        // 낮은 우선순위 작업들
        callback()
      })
    },
    [startTransition]
  )

  // 즉시 실행되어야 하는 작업
  const startImmediateTransition = useCallback((callback: () => void) => {
    // 즉시 실행 (전환 없이)
    callback()
  }, [])

  return {
    isPending,
    startLowPriorityTransition,
    startImmediateTransition,
  }
}

// 성능 모니터링을 위한 훅
export const usePerformanceMonitor = () => {
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`)
      fn()
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)

      const measure = performance.getEntriesByName(name)[0]
      console.log(`${name} took ${measure.duration.toFixed(2)}ms`)
    } else {
      fn()
    }
  }, [])

  return { measurePerformance }
}
