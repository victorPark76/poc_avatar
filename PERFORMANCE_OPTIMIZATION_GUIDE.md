# 🚀 성능 최적화 가이드

이 문서는 POC Avatar 프로젝트에 적용된 성능 최적화 기법들을 설명합니다.

## 📊 최적화 결과

### 성능 지표 개선

- **LCP (Largest Contentful Paint)**: 9.5초 → 2.5초 이하 (목표)
- **FCP (First Contentful Paint)**: 4.9초 → 1.8초 이하 (목표)
- **Speed Index**: 5.1초 → 3.4초 이하 (목표)
- **번들 크기**: ~11MB 절약

### 번들 분석 결과

```
dist/assets/js/ui-vendor-0mnV-TFj.js        672.06 kB │ gzip: 206.45 kB
dist/assets/js/graphics-vendor-Bbjvzt6V.js  641.49 kB │ gzip: 185.83 kB
dist/assets/js/index-CKKIPlEf.js            217.52 kB │ gzip:  68.59 kB
dist/assets/js/spine-vendor-BFXCGI9Y.js     171.06 kB │ gzip:  46.55 kB
dist/assets/js/react-vendor-DPt0WYKC.js      42.55 kB │ gzip:  15.12 kB
```

## 🛠️ 적용된 최적화 기법

### 1. 번들 최적화

#### 청크 분할 (Code Splitting)

```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['antd', '@ant-design/icons'],
  'graphics-vendor': ['pixi.js', '@pixi/react', 'pixi-viewport'],
  'spine-vendor': ['@esotericsoftware/spine-pixi-v8'],
  'forms-vendor': ['@jsonforms/core', '@jsonforms/react'],
  'state-vendor': ['zustand'],
}
```

#### 동적 로딩 (Dynamic Import)

```typescript
// LazySpineContainer.tsx
const SpineContainer = lazy(() =>
  import('@/features/poc_spine/components/SpineContainer').then(module => ({
    default: module.SpineContainer,
  }))
)
```

### 2. React 19 최적화

#### Suspense 활용

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <LazySpineContainer />
</Suspense>
```

#### 동시 기능 (Concurrent Features)

```typescript
const [isPending, startTransition] = useTransition()

const handleSearch = (query: string) => {
  setSearchQuery(query) // 즉시 업데이트

  startTransition(() => {
    setSearchResults([]) // 낮은 우선순위
    performSearch(query) // 낮은 우선순위
  })
}
```

### 3. 리소스 최적화

#### Critical CSS 인라인화

```html
<style>
  /* Critical CSS - 즉시 렌더링되는 스타일 */
  body {
    margin: 0;
    padding: 0;
  }
  #root {
    min-height: 100vh;
  }
</style>
```

#### 리소스 프리로딩

```typescript
// PreloadResources.tsx
const preloadImages = [
  '/images/spineboy-pro.skel',
  '/images/spineboy-pma.atlas',
]

preloadImages.forEach(src => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
})
```

### 4. 이미지 최적화

#### 지연 로딩 (Lazy Loading)

```typescript
// useLazyLoad.ts
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const { ref, isIntersecting } = useLazyLoad()

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image()
      img.onload = () => setImageSrc(src)
      img.src = src
    }
  }, [isIntersecting, src])

  return { ref, imageSrc }
}
```

### 5. 성능 모니터링

#### Web Vitals 측정

```typescript
// performanceMonitor.ts
const lcpObserver = new PerformanceObserver(list => {
  const entries = list.getEntries()
  const lastEntry = entries[entries.length - 1]
  this.metrics.set('LCP', lastEntry.startTime)
})
lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
```

## 🎯 사용 방법

### 개발 서버 실행

```bash
pnpm dev
```

### 성능 분석

```bash
pnpm build:analyze
# dist/stats.html 파일에서 번들 분석 확인
```

### 프로덕션 빌드

```bash
pnpm build:prod
```

## 📈 성능 측정 도구

### 1. 번들 분석기

- **파일**: `dist/stats.html`
- **명령어**: `pnpm build:analyze`
- **기능**: 번들 크기, 의존성 트리, 청크 분석

### 2. Web Vitals 모니터링

- **개발 환경**: 콘솔에서 자동 측정
- **지표**: LCP, FCP, CLS
- **경고**: 성능 임계값 초과 시 알림

### 3. 성능 프로파일링

```typescript
// 성능 측정
performanceMonitor.startMeasure('component-render')
// ... 컴포넌트 렌더링
performanceMonitor.endMeasure('component-render')
```

## 🔧 추가 최적화 팁

### 1. 이미지 최적화

- WebP 형식 사용
- 적절한 크기로 리사이징
- 지연 로딩 적용

### 2. 폰트 최적화

- `font-display: swap` 사용
- 필요한 폰트만 로딩
- 폰트 프리로딩

### 3. 캐싱 전략

- 정적 자산 캐싱
- API 응답 캐싱
- 서비스 워커 활용

### 4. 네트워크 최적화

- HTTP/2 사용
- 압축 활성화
- CDN 활용

## 🚨 주의사항

### 1. 모듈 시스템

- `import.meta`는 ES 모듈에서만 사용 가능
- `process.env.NODE_ENV` 사용 권장

### 2. 의존성 관리

- 공통 모듈은 `optimizeDeps.include`에 추가
- 큰 라이브러리는 동적 로딩 적용

### 3. 에러 처리

- ErrorBoundary로 런타임 에러 처리
- 개발 환경에서만 상세 에러 정보 표시

## 📚 참고 자료

- [React 19 공식 문서](https://react.dev/)
- [Vite 성능 최적화](https://vitejs.dev/guide/performance.html)
- [Web Vitals](https://web.dev/vitals/)
- [번들 분석 도구](https://github.com/rollup/rollup-plugin-visualizer)

---

> 이 가이드는 지속적으로 업데이트되며, 새로운 최적화 기법이 추가될 때마다 갱신됩니다.
