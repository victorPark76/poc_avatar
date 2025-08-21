import { Spine } from '@esotericsoftware/spine-pixi-v8'
import { extend } from '@pixi/react'
import { Assets, Container, Graphics, Sprite } from 'pixi.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { calculatePositionWithRatio, calculateScale } from '@/utils/aspectRatio'

extend({
  Container,
  Graphics,
  Sprite,
})

interface SpinePreviewProps {
  skeletonSrc: string
  atlasSrc: string
  initialAnimation?: string
  scale?: number
  autoPlay?: boolean
  x?: number | string
  y?: number | string
  className?: string
  style?: React.CSSProperties
  baseSize?: { width: number; height: number }
  initialX?: number
  initialY?: number
  positionType?: 'percentage' | 'absolute' | 'ratio'
}

export const SpinePreviewContainer = ({
  skeletonSrc,
  atlasSrc,
  initialAnimation = 'walk',
  scale = 0.5,
  autoPlay = true,
  x,
  y,
  baseSize = { width: 800, height: 450 },
  initialX = 50,
  initialY = 50,
  positionType = 'percentage',
}: SpinePreviewProps) => {
  const containerRef = useRef<Container>(null)
  const [isReady, setIsReady] = useState(false)
  const spineRef = useRef<Spine | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Unique aliases per instance to prevent collisions with other Spine users
  const aliases = useMemo(() => {
    const uid = Math.random().toString(36).slice(2)
    return {
      skeleton: `spineSkeleton_preview_${uid}`,
      atlas: `spineAtlas_preview_${uid}`,
    }
  }, [])

  const memoizedBaseSize = useMemo(() => baseSize, [baseSize])

  // Helper function to parse position value (number or percentage)
  const parsePosition = useCallback(
    (value: number | string | undefined, containerSize: number): number => {
      if (value === undefined) return containerSize / 2 // 기본값: 중앙

      if (typeof value === 'number') {
        return value
      }

      if (typeof value === 'string') {
        if (value.endsWith('%')) {
          const percentage = parseFloat(value.replace('%', ''))
          return (containerSize * percentage) / 100
        }
        return parseFloat(value) || containerSize / 2
      }

      return containerSize / 2
    },
    []
  )

  const updateLayout = useCallback(() => {
    if (!spineRef.current || !containerRef.current || !spineRef.current.parent)
      return

    // 화면 크기 가져오기 (BunnySprite와 동일한 로직)
    const width = window.innerWidth
    const height = (width * 9) / 16 // 16:9 비율

    let spineX: number
    let spineY: number

    // x, y props가 있으면 우선 사용 (좌표 또는 퍼센트)
    if (x !== undefined || y !== undefined) {
      spineX = parsePosition(x, width)
      spineY = parsePosition(y, height)
    } else {
      // x, y props가 없으면 initialX, initialY와 positionType 사용 (BunnySprite와 동일한 로직)
      const position = calculatePositionWithRatio(
        width,
        height,
        { x: initialX, y: initialY, type: positionType },
        memoizedBaseSize
      )
      spineX = position.x
      spineY = position.y
    }

    // 스케일 계산 (BunnySprite와 동일한 로직)
    const calculatedScale = calculateScale(width, height) * scale

    console.log('Spine 위치 및 스케일:', {
      x: spineX,
      y: spineY,
      scale: calculatedScale,
      screenSize: { width, height },
      baseSize: memoizedBaseSize,
      positionSource:
        x !== undefined || y !== undefined ? 'x,y props' : 'initialX,initialY',
      positionValues: { x, y, initialX, initialY, positionType },
    })

    // Update spine position and scale
    spineRef.current.x = spineX
    spineRef.current.y = spineY
    spineRef.current.scale.set(calculatedScale)
  }, [
    scale,
    x,
    y,
    initialX,
    initialY,
    positionType,
    memoizedBaseSize,
    parsePosition,
  ])

  const addSpine = useCallback(() => {
    console.log('containerRef', containerRef.current)
    if (!containerRef.current) return

    // 기존 Spine 객체가 있으면 제거
    if (spineRef.current && containerRef.current) {
      containerRef.current.removeChild(spineRef.current)
      spineRef.current.destroy()
      spineRef.current = null
    }

    try {
      const spine = Spine.from({
        skeleton: aliases.skeleton,
        atlas: aliases.atlas,
        scale: 1, // 기본 스케일로 설정, updateLayout에서 반응형 스케일 적용
        autoUpdate: true,
      })

      console.log('spine', spine)
      spineRef.current = spine

      containerRef.current.addChild(spine)
      if (autoPlay && initialAnimation) {
        spine.state.setAnimation(0, initialAnimation, true)
      }

      // Ensure layout is correct after adding (position and scale)
      updateLayout()
    } catch (e) {
      console.error('Failed to create Spine:', e)
      setError('Failed to create Spine instance')
    }
  }, [aliases, autoPlay, initialAnimation, updateLayout])

  useEffect(() => {
    let mounted = true

    // Basic extension validation
    const skelOk = /(\.(skel|json))(\?|#|$)/i.test(skeletonSrc)
    const atlasOk = /(\.(atlas))(\?|#|$)/i.test(atlasSrc)
    if (!skelOk || !atlasOk) {
      setError('Invalid file types. Expect .skel/.json and .atlas')
      return
    }

    const load = async () => {
      setError(null)
      try {
        const skeletonItem = {
          alias: aliases.skeleton,
          src: skeletonSrc,
        }
        const atlasItem = {
          alias: aliases.atlas,
          src: atlasSrc,
        }

        // Let Pixi/Spine choose appropriate parsers based on file extensions
        await Assets.load([skeletonItem, atlasItem])
        if (!mounted) return
        setIsReady(true)
      } catch (e) {
        console.error('Failed to load spine assets:', e)
        setError(
          'Failed to load assets. Check URLs and server responses (200).'
        )
      }
    }
    load()
    return () => {
      mounted = false
      if (spineRef.current) {
        // 컨테이너에서 제거
        if (containerRef.current) {
          containerRef.current.removeChild(spineRef.current)
        }
        // Spine 객체 파괴
        spineRef.current.destroy()
        spineRef.current = null
      }
      // Do not unload globally; aliases are unique and will GC with page lifecycle
    }
  }, [aliases, skeletonSrc, atlasSrc])

  useEffect(() => {
    if (!isReady || !containerRef.current) return
    addSpine()
  }, [isReady, addSpine])

  // 화면 크기 변경 감지 및 위치/크기 자동 조정 (BunnySprite와 동일한 로직)
  useEffect(() => {
    const handleResize = () => {
      // Spine 객체가 유효한 경우에만 업데이트
      if (spineRef.current && containerRef.current && spineRef.current.parent) {
        updateLayout()
      }
    }

    updateLayout()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateLayout])

  return (
    <>
      {isReady && (
        <pixiContainer
          ref={ref => {
            if (ref) {
              containerRef.current = ref
            }
          }}
        />
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            color: '#ff6b6b',
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
    </>
  )
}
