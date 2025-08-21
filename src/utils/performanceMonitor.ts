// 성능 모니터링 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 성능 측정 시작
  startMeasure(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`)
    }
  }

  // 성능 측정 종료
  endMeasure(name: string): number {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)

      const measure = performance.getEntriesByName(name)[0]
      const duration = measure.duration

      this.metrics.set(name, duration)

      // 개발 환경에서만 로그 출력
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`)
      }

      return duration
    }
    return 0
  }

  // Web Vitals 측정
  measureWebVitals(): void {
    if (typeof window === 'undefined') return

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.set('LCP', lastEntry.startTime)

        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(
          entry => entry.name === 'first-contentful-paint'
        )
        if (fcpEntry) {
          this.metrics.set('FCP', fcpEntry.startTime)

          if (process.env.NODE_ENV === 'development') {
            console.log(`🎨 FCP: ${fcpEntry.startTime.toFixed(2)}ms`)
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.metrics.set('CLS', clsValue)

        if (process.env.NODE_ENV === 'development') {
          console.log(`📐 CLS: ${clsValue.toFixed(4)}`)
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
  }

  // 성능 리포트 생성
  generateReport(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // 성능 경고 체크
  checkPerformanceWarnings(): string[] {
    const warnings: string[] = []
    const report = this.generateReport()

    // 성능이 양호한 경우 경고를 표시하지 않음
    if (report.LCP && report.LCP > 2500) {
      warnings.push(`LCP가 느립니다: ${report.LCP.toFixed(2)}ms (목표: < 2.5s)`)
    }

    if (report.FCP && report.FCP > 1800) {
      warnings.push(`FCP가 느립니다: ${report.FCP.toFixed(2)}ms (목표: < 1.8s)`)
    }

    if (report.CLS && report.CLS > 0.1) {
      warnings.push(`CLS가 높습니다: ${report.CLS.toFixed(4)} (목표: < 0.1)`)
    }

    return warnings
  }
}

// 전역 인스턴스
export const performanceMonitor = PerformanceMonitor.getInstance()
