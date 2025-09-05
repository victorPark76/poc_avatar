import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { adjustContainerToAspectRatio } from '../../../utils/aspectRatio'
import { SpineBoy } from '../ts/spine'
import { BunnySprite } from './BunnySprite'
import { CloudSprite } from './CloudSprite'
import { SpineContainer } from './SpineContainer'
import { SpineControlsInline } from './SpineControlsInline'
import { SpineControlsSound } from './SpineControlsSound'
import { SpinePreview } from './SpinePreview'
import { SpinePreviewContainer } from './SpinePreviewContainer'

extend({
  Container,
  Graphics,
  Sprite,
})

export const MainApplication = () => {
  const parentRef = useRef(null)
  const [spineBoy, setSpineBoy] = useState<SpineBoy | null>(null)
  const [isSpineReady, setIsSpineReady] = useState(false)
  const [spineSize, setSpineSize] = useState(0.3)

  // Spine 상태 변경 핸들러
  const handleSpineReady = useCallback(
    (spineBoy: SpineBoy | null, isReady: boolean) => {
      setSpineBoy(spineBoy)
      setIsSpineReady(isReady)
    },
    []
  )

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
          <BunnySprite
            initialX={10}
            initialY={70}
            initialScale={1}
            positionType="percentage"
          />
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
        </Application>
        {/* Spine 제어 UI - Pixi.js Application 외부에 렌더링 */}
        <SpineControlsInline spineBoy={spineBoy} isSpineReady={isSpineReady} />
      </div>
      <SpineControlsSound
        spineBoy={spineBoy}
        isSpineReady={isSpineReady}
        spineSize={spineSize}
        onSpineSizeChange={setSpineSize}
      />
      <div className="flex">
        <div style={{ width: '50%', height: '100%' }}>
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
        <div className={'relative'} style={{ width: '50%', height: '100%' }}>
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
      <div className="w-full h-[600px] flex absolute top-0 left-0 z-80">
        <div style={{ width: '50%', height: '100%' }}></div>
        <div className={'relative'} style={{ width: '50%', height: '100%' }}>
          <SpinePreview
            skeletonSrc="/effects/spine/microphone/ui_btn_speaking_timer.json"
            atlasSrc="/effects/spine/microphone/ui_btn_speaking_timer.atlas"
            initialAnimation="btn_unable"
            scale={2}
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
            scale={2}
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
