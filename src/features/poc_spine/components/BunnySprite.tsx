import { Assets, Sprite, Texture } from 'pixi.js'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { calculatePositionWithRatio, calculateScale } from '@/utils/aspectRatio'

export interface BunnySpriteProps {
  initialX?: number
  initialY?: number
  initialScale?: number
  positionType?: 'percentage' | 'absolute' | 'ratio'
  baseSize?: { width: number; height: number }
}

export const BunnySprite = forwardRef<Sprite, BunnySpriteProps>(
  (
    {
      initialX = 15,
      initialY = 30,
      initialScale = 1,
      positionType = 'percentage',
      baseSize = { width: 800, height: 450 },
    },
    ref
  ) => {
    // The Pixi.js `Sprite`
    const spriteRef = useRef<Sprite>(null)
    const [texture, setTexture] = useState(Texture.EMPTY)
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
    const [currentScale, setCurrentScale] = useState(initialScale)

    // baseSize를 useMemo로 메모이제이션하여 불필요한 재생성 방지
    const memoizedBaseSize = useMemo(
      () => baseSize,
      [baseSize.width, baseSize.height]
    )

    // updatePositionAndScale 함수를 useCallback으로 메모이제이션
    const updatePositionAndScale = useCallback(() => {
      const width = window.innerWidth
      const height = (width * 9) / 16 // 16:9 비율

      // 위치 계산
      const position = calculatePositionWithRatio(
        width,
        height,
        { x: initialX, y: initialY, type: positionType },
        memoizedBaseSize
      )

      // 스케일 계산
      const scale = calculateScale(width, height) * initialScale

      setCurrentPosition(position)
      setCurrentScale(scale)
    }, [initialX, initialY, initialScale, positionType, memoizedBaseSize])

    // 화면 크기 변경 감지 및 위치/크기 자동 조정
    useEffect(() => {
      updatePositionAndScale()
      window.addEventListener('resize', updatePositionAndScale)

      return () => {
        window.removeEventListener('resize', updatePositionAndScale)
      }
    }, [updatePositionAndScale])

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
      if (texture === Texture.EMPTY) {
        Assets.load('https://pixijs.com/assets/bunny.png').then(result => {
          setTexture(result)
        })
      }
    }, [texture])

    return (
      <pixiSprite
        ref={ref || spriteRef}
        anchor={0.5}
        eventMode={'static'}
        texture={texture}
        x={currentPosition.x}
        y={currentPosition.y}
        scale={currentScale}
      />
    )
  }
)
