import { usePixiApp } from '../hooks/usePixiApp'
import type { PixiCanvasProps } from '../types'

/**
 * PixiCanvas 컴포넌트 - PIXI.js 캔버스를 렌더링하는 기본 컴포넌트
 * - usePixiApp 훅을 사용하여 PIXI.js 애플리케이션 관리
 * - 애니메이션 토글 기능 제공
 * - 로딩 상태 표시
 * @param props - PixiCanvasProps 타입의 속성 (width, height 등)
 */
export default function PixiCanvas(props: PixiCanvasProps) {
  const { containerRef, isInitialized, toggleAnimation } = usePixiApp(props)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg"
        style={{
          width: props.width || 800,
          height: props.height || 600,
        }}
      />

      {/* 컨트롤 패널 */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        <button
          onClick={toggleAnimation}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          애니메이션 토글
        </button>
      </div>

      {/* 로딩 상태 */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>Pixi.js 초기화 중...</div>
          </div>
        </div>
      )}
    </div>
  )
}
