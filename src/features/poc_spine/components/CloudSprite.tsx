import { Assets, Texture } from 'pixi.js'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ASPECT_RATIO_16_9,
  calculateHeightByWidth,
  calculatePositionWithRatio,
  calculateScale,
} from '../../../utils/aspectRatio'

export interface CloudConfig {
  x: number
  y: number
  speed: number
  scale: number
  alpha: number
  layer: number
}

export interface CloudSpriteProps {
  clouds?: CloudConfig[]
  baseSize?: { width: number; height: number }
  positionType?: 'percentage' | 'absolute' | 'ratio'
}

export const CloudSprite = forwardRef<unknown, CloudSpriteProps>(
  (
    {
      clouds: initialClouds,
      baseSize = { width: 800, height: 450 },
      positionType = 'percentage',
    },
    ref
  ) => {
    const animationRef = useRef<number | null>(null)
    const cloudSpriteRefs = useRef<unknown[]>([])
    const [screenWidth, setScreenWidth] = useState(800)
    const [screenHeight, setScreenHeight] = useState(450)

    const [texture, setTexture] = useState(Texture.EMPTY)

    // 원본 Y 값들을 보존하기 위한 상태 추가
    const [originalYValues] = useState<number[]>(
      (
        initialClouds || [
          { x: 0, y: 15, speed: 1.2, scale: 0.3, alpha: 0, layer: 0 },
          { x: 100, y: 25, speed: 0.8, scale: 0.15, alpha: 0, layer: 1 },
          { x: 200, y: 35, speed: 0.5, scale: 0.05, alpha: 0, layer: 2 },
        ]
      ).map(cloud => cloud.y)
    )

    const [clouds, setClouds] = useState<CloudConfig[]>(
      initialClouds || [
        { x: 0, y: 15, speed: 1.2, scale: 0.3, alpha: 0, layer: 0 }, // 가까운 구름 (크고 빠름)
        { x: 100, y: 25, speed: 0.8, scale: 0.15, alpha: 0, layer: 1 }, // 중간 거리 구름 (중간 크기, 중간 속도)
        { x: 200, y: 35, speed: 0.5, scale: 0.05, alpha: 0, layer: 2 }, // 먼 구름 (작고 느림)
      ]
    )

    // baseSize를 useMemo로 메모이제이션
    const memoizedBaseSize = useMemo(
      () => baseSize,
      [baseSize.width, baseSize.height]
    )

    // ref를 통해 부모 컴포넌트에 cloudSpriteRefs 전달
    useEffect(() => {
      if (ref && typeof ref === 'object') {
        ;(ref as { current: unknown }).current = cloudSpriteRefs.current
      }
    }, [ref])

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
      if (texture === Texture.EMPTY) {
        Assets.load('/images/cloud.png').then(result => {
          setTexture(result)
        })
      }
    }, [texture])

    // updateScreenSize 함수를 useCallback으로 메모이제이션
    const updateScreenSize = useCallback(() => {
      const width = window.innerWidth
      const height = calculateHeightByWidth(width, ASPECT_RATIO_16_9)
      setScreenWidth(width)
      setScreenHeight(height)

      // 구름들의 Y 위치를 원본 Y 값(퍼센트)을 사용하여 새로운 화면 크기에 맞춰 업데이트
      setClouds(prevClouds =>
        prevClouds.map((cloud, index) => {
          const originalY = originalYValues[index]
          const yPosition = calculatePositionWithRatio(
            width,
            height,
            {
              x: 0,
              y: originalY,
              type: positionType,
            },
            memoizedBaseSize
          )
          return { ...cloud, y: yPosition.y }
        })
      )
    }, [positionType, memoizedBaseSize, originalYValues])

    // 화면 크기 변경 감지
    useEffect(() => {
      updateScreenSize()
      window.addEventListener('resize', updateScreenSize)

      return () => {
        window.removeEventListener('resize', updateScreenSize)
      }
    }, [updateScreenSize])

    // animate 함수를 useCallback으로 메모이제이션
    const animate = useCallback(() => {
      setClouds(prevClouds =>
        prevClouds.map(cloud => {
          const newX = cloud.x + cloud.speed
          let newAlpha = cloud.alpha

          // 페이드인/아웃 효과 계산 (화면 크기에 맞춰 조정)
          const fadeDistance = Math.min(100, screenWidth * 0.1) // 화면 넓이의 10% 또는 최대 100px

          if (newX < 0) {
            // 화면 왼쪽 밖: 완전 투명
            newAlpha = 0
          } else if (newX < fadeDistance) {
            // 화면 왼쪽 영역: 페이드인
            newAlpha = newX / fadeDistance
          } else if (newX > screenWidth - fadeDistance) {
            // 화면 오른쪽 영역: 페이드아웃
            newAlpha = (screenWidth - newX) / fadeDistance
          } else {
            // 화면 중앙: 완전 불투명
            newAlpha = 1
          }

          if (newX > screenWidth) {
            return { ...cloud, x: -100 - Math.random() * 200, alpha: 0 } // 랜덤한 위치에서 다시 시작
          }
          return { ...cloud, x: newX, alpha: newAlpha }
        })
      )
    }, [screenWidth])

    // 구름 애니메이션 효과
    useEffect(() => {
      animationRef.current = setInterval(animate, 50)

      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current)
        }
      }
    }, [animate])

    return (
      <>
        {clouds.map((cloud, index) => {
          // 각 구름의 스케일을 화면 크기에 맞춰 계산
          const scale = calculateScale(screenWidth, screenHeight) * cloud.scale

          return (
            <pixiSprite
              key={index}
              ref={el => {
                cloudSpriteRefs.current[index] = el
              }}
              anchor={0.5}
              eventMode={'static'}
              texture={texture}
              x={cloud.x}
              y={cloud.y}
              scale={scale}
              alpha={cloud.alpha}
            />
          )
        })}
      </>
    )
  }
)
