import { adjustContainerToAspectRatio } from '@/utils/aspectRatio'
import { Spine } from '@esotericsoftware/spine-pixi-v8'
import { Application, extend } from '@pixi/react'
import { Assets, Container, Graphics, Sprite } from 'pixi.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  backgroundAlpha?: number
  background?: string
  autoPlay?: boolean
  x?: number | string
  y?: number | string
  className?: string

  style?: React.CSSProperties
}

export const SpinePreview = ({
  skeletonSrc,
  atlasSrc,
  initialAnimation = 'walk',
  scale = 0.5,
  background = 'transparent',
  backgroundAlpha = 0,
  autoPlay = true,
  x,
  y,
  className,
  style,
}: SpinePreviewProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null)
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
    if (!parentRef.current || !spineRef.current) return

    // Adjust parent container to 16:9 and position spine accordingly
    const { width: parentWidth, height: parentHeight } =
      adjustContainerToAspectRatio(parentRef.current)

    // Calculate responsive scale based on container width
    const baseWidth = 1920 // 기준 너비 (16:9에서 1920px)
    const responsiveScale = (parentWidth / baseWidth) * scale

    // Parse position values (number, percentage, or default to center)
    const spineX = parsePosition(x, parentWidth)
    const spineY = parsePosition(y, parentHeight)

    // Update spine position and scale
    spineRef.current.x = spineX
    spineRef.current.y = spineY
    spineRef.current.scale.set(responsiveScale)
  }, [scale, x, y, parsePosition])

  const addSpine = useCallback(() => {
    if (!containerRef.current) return
    try {
      const spine = Spine.from({
        skeleton: aliases.skeleton,
        atlas: aliases.atlas,
        scale: 1, // 기본 스케일로 설정, updateLayout에서 반응형 스케일 적용
        autoUpdate: true,
      })
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

  // Handle resize and container size changes to keep 16:9 full width
  useEffect(() => {
    const onResize = () => updateLayout()
    window.addEventListener('resize', onResize)

    const observer = new ResizeObserver(() => updateLayout())
    if (parentRef.current) observer.observe(parentRef.current)

    // Initial layout
    updateLayout()

    return () => {
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [updateLayout])

  return (
    <div
      ref={parentRef}
      className={className}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        maxHeight: '100vh',
        ...style,
      }}
    >
      <Application
        resizeTo={parentRef}
        background={background}
        backgroundAlpha={backgroundAlpha}
        autoDensity
        resolution={window.devicePixelRatio || 1}
        antialias={true}
        premultipliedAlpha={backgroundAlpha < 1}
      >
        {isReady && (
          <pixiContainer
            ref={ref => {
              if (ref) {
                containerRef.current = ref
              }
            }}
          />
        )}
      </Application>
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
    </div>
  )
}
