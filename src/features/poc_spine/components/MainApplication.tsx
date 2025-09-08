import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adjustContainerToAspectRatio } from '../../../utils/aspectRatio'
import { SpineBoy } from '../ts/spine'
import { BunnySprite, type BunnySpriteRef } from './BunnySprite'
import { CloudSprite } from './CloudSprite'
import SpineContainer from './SpineContainer'
import { SpineControlsInline } from './SpineControlsInline'
import { SpineControlsSound } from './SpineControlsSound'
import { SpinePreview } from './SpinePreview'
import SpinePreviewContainer from './SpinePreviewContainer'

extend({
  Container,
  Graphics,
  Sprite,
})

export const MainApplication = () => {
  const parentRef = useRef(null)
  const bunnyRef = useRef<BunnySpriteRef>(null)
  const [spineBoy, setSpineBoy] = useState<SpineBoy | null>(null)
  const [isSpineReady, setIsSpineReady] = useState(false)
  const [spineSize, setSpineSize] = useState(0.3)
  const [bunnyPosition, setBunnyPosition] = useState({ x: 10, y: 70 })
  const [bunnyBtnView, setBunnyBtnView] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // baseSize를 메모이제이션하여 불필요한 재렌더링 방지
  const baseSize = useMemo(() => ({ width: 800, height: 450 }), [])

  // Spine 상태 변경 핸들러
  const handleSpineReady = useCallback(
    (spineBoy: SpineBoy | null, isReady: boolean) => {
      setSpineBoy(spineBoy)
      setIsSpineReady(isReady)
    },
    []
  )

  // 버니 이동 함수들
  const moveBunnyLeft = useCallback(() => {
    if (bunnyRef.current) {
      bunnyRef.current.moveLeft()
    }
  }, [])

  const moveBunnyRight = useCallback(() => {
    if (bunnyRef.current) {
      bunnyRef.current.moveRight()
    }
  }, [])

  const moveBunnyUp = useCallback(() => {
    if (bunnyRef.current) {
      bunnyRef.current.moveUp()
    }
  }, [])

  const moveBunnyDown = useCallback(() => {
    if (bunnyRef.current) {
      bunnyRef.current.moveDown()
    }
  }, [])

  // 버니 위치 변경 핸들러
  const handleBunnyPositionChange = useCallback(
    (position: { x: number; y: number }) => {
      setBunnyPosition(position)
    },
    []
  )

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      const parentElement = parentRef.current as unknown as HTMLElement
      setDragStart({
        x:
          e.clientX -
          (bunnyPosition.x / 100) * (parentElement?.clientWidth || 800),
        y:
          e.clientY -
          (bunnyPosition.y / 100) * (parentElement?.clientHeight || 450),
      })
    },
    [bunnyPosition]
  )

  // 드래그 중 핸들러
  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !parentRef.current) return

      const parentElement = parentRef.current as unknown as HTMLElement
      const parentRect = parentElement.getBoundingClientRect()
      const newX = ((e.clientX - dragStart.x) / parentRect.width) * 100
      const newY = ((e.clientY - dragStart.y) / parentRect.height) * 100

      // 화면 경계 내에서만 이동 가능하도록 제한
      const clampedX = Math.max(0, Math.min(100, newX))
      const clampedY = Math.max(0, Math.min(100, newY))

      setBunnyPosition({ x: clampedX, y: clampedY })

      // bunnyRef를 통해 실제 캐릭터 위치도 업데이트
      if (bunnyRef.current) {
        bunnyRef.current.setPosition(clampedX, clampedY)
      }
    },
    [isDragging, dragStart]
  )

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)

      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // 부모 컨테이너의 높이를 16:9 비율로 설정하는 함수를 useCallback으로 메모이제이션
  const updateContainerHeight = useCallback(() => {
    if (parentRef.current) {
      const parent = parentRef.current as HTMLElement

      // 유틸리티 함수를 사용하여 컨테이너 크기 조정
      adjustContainerToAspectRatio(parent)
    }
  }, [])

  // 윈도우 리사이즈 이벤트 리스너
  useEffect(() => {
    // 초기 크기 설정
    updateContainerHeight()

    // 디바운스된 리사이즈 핸들러
    let resizeTimeout: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        updateContainerHeight()
      }, 100)
    }

    window.addEventListener('resize', debouncedResize)

    // ResizeObserver를 사용하여 부모 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      updateContainerHeight()
    })

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current)
    }

    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
    }
  }, [updateContainerHeight])

  return (
    <>
      <h1 className="text-2xl font-bold text-center">웹 아바타 R&D</h1>
      <div
        id="main-application"
        ref={parentRef}
        style={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'block',
        }}
      >
        <Application
          resizeTo={parentRef}
          background={'#1099bb'}
          backgroundAlpha={1}
          resolution={window.devicePixelRatio || 1}
          autoDensity={true}
          antialias={true}
        >
          <CloudSprite
            clouds={[
              { x: 0, y: 15, speed: 1.2, scale: 0.3, alpha: 0, layer: 0 },
              { x: 100, y: 25, speed: 0.8, scale: 0.15, alpha: 0, layer: 1 },
              { x: 200, y: 35, speed: 0.5, scale: 0.05, alpha: 0, layer: 2 },
            ]}
            positionType="percentage"
          />
          {/* Spine 객체를 여기에 추가 */}
          <SpineContainer
            key={'a'}
            size={spineSize}
            initialAnimation="walk"
            onSpineReady={handleSpineReady}
          />
          <SpinePreviewContainer
            skeletonSrc="/images/dragon-ess.json"
            atlasSrc="/images/dragon.atlas"
            initialAnimation="flying"
            scale={0.2}
            x="80%"
            y="40%" // 16:9 비율의 기준 크기
          />
          <SpinePreviewContainer
            skeletonSrc="/images/dragon-ess.json"
            atlasSrc="/images/dragon.atlas"
            initialAnimation="flying"
            scale={0.3}
            x="20%"
            y="50%" // 16:9 비율의 기준 크기
          />
          <BunnySprite
            ref={bunnyRef}
            initialX={10}
            initialY={70}
            initialScale={1}
            positionType="percentage"
            baseSize={baseSize}
            onPositionChange={handleBunnyPositionChange}
          />
        </Application>
        <div
          id="bunny-btn-view"
          className="absolute z-40000"
          style={{
            position: 'absolute',
            left: `${bunnyPosition.x}%`,
            top: `${bunnyPosition.y + 5}%`, // bunny 캐릭터 발쪽에 위치하도록 5% 오프셋 추가
            transform: 'translateX(-50%)', // 중앙 정렬을 위한 변환
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex  gap-[3px]">
              <button
                id="bunny-btn-view-toggle"
                onClick={() => {
                  if (!isDragging) {
                    setBunnyBtnView(!bunnyBtnView)
                  }
                }}
                onMouseDown={handleDragStart}
                className={`text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors cursor-move select-none ${
                  isDragging
                    ? 'bg-blue-700 shadow-lg scale-105'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                style={{ userSelect: 'none' }}
              >
                {bunnyBtnView ? 'Hide' : 'Show'}
              </button>
              {bunnyBtnView && (
                <>
                  <button
                    onClick={moveBunnyLeft}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={moveBunnyUp}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={moveBunnyDown}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                  >
                    ↓
                  </button>
                  <button
                    onClick={moveBunnyRight}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* 이동 버튼 UI */}

        {/* Spine 제어 UI - Pixi.js Application 외부에 렌더링 */}
        <SpineControlsInline spineBoy={spineBoy} isSpineReady={isSpineReady} />
        <div className="w-[100px] h-[100px] absolute top-0 right-0 z-2080">
          <div className={'relative'} style={{ width: '100%', height: '100%' }}>
            <SpinePreview
              skeletonSrc="/effects/spine/microphone/ui_btn_speaking_timer.json"
              atlasSrc="/effects/spine/microphone/ui_btn_speaking_timer.atlas"
              initialAnimation="btn_unable"
              scale={3}
              x="0"
              y="0"
              className={'!absolute top-0 left-0 z-30'}
              background="transparent"
              backgroundAlpha={0}
            />
            <SpinePreview
              skeletonSrc="/effects/spine/microphone/ui_btn_speaking_timer_gauge.json"
              atlasSrc="/effects/spine/microphone/ui_btn_speaking_timer_gauge.atlas"
              initialAnimation="enable"
              scale={3}
              x="0"
              y="0"
              backgroundAlpha={0}
              background="transparent"
              className={'!absolute top-0 left-0 z-50'}
            />
          </div>
        </div>
      </div>
      <SpineControlsSound
        spineBoy={spineBoy}
        isSpineReady={isSpineReady}
        spineSize={spineSize}
        onSpineSizeChange={setSpineSize}
      />
      <div className="flex" style={{ minHeight: '400px' }}>
        <div style={{ width: '50%', height: '400px', position: 'relative' }}>
          <SpinePreview
            skeletonSrc="/images/dragon-ess.json"
            atlasSrc="/images/dragon.atlas"
            initialAnimation="flying"
            scale={0.8}
            background="#380000"
            x="50%"
            y="50%"
          />
        </div>
        <div className={'relative'} style={{ width: '50%', height: '400px' }}>
          <SpinePreview
            skeletonSrc="/effects/spine/microphone/ui_btn_speaking_timer.json"
            atlasSrc="/effects/spine/microphone/ui_btn_speaking_timer.atlas"
            initialAnimation="btn_unable"
            scale={3}
            x="50%"
            y="50%"
            className={'!absolute top-0 left-0 z-30'}
            background="transparent"
            backgroundAlpha={0}
          />
          <SpinePreview
            skeletonSrc="/effects/spine/microphone/ui_btn_speaking_timer_gauge.json"
            atlasSrc="/effects/spine/microphone/ui_btn_speaking_timer_gauge.atlas"
            initialAnimation="enable"
            scale={3}
            x="50%"
            y="50%"
            backgroundAlpha={0}
            background="transparent"
            className={'!absolute top-0 left-0 z-50'}
          />
        </div>
      </div>
    </>
  )
}
