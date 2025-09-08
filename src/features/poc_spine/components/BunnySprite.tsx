import { gsap } from 'gsap'
import { Assets, Sprite, Texture } from 'pixi.js'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { calculatePositionWithRatio, calculateScale } from '@/utils/aspectRatio'

export interface BunnySpriteRef {
  moveLeft: () => void
  moveRight: () => void
  moveUp: () => void
  moveDown: () => void
  getPosition: () => { x: number; y: number }
  setPosition: (x: number, y: number) => void
}

export interface BunnySpriteProps {
  initialX?: number
  initialY?: number
  initialScale?: number
  positionType?: 'percentage' | 'absolute' | 'ratio'
  baseSize?: { width: number; height: number }
  onPositionChange?: (position: { x: number; y: number }) => void
}

export const BunnySprite = forwardRef<BunnySpriteRef, BunnySpriteProps>(
  (
    {
      initialX = 15,
      initialY = 30,
      initialScale = 1,
      positionType = 'percentage',
      baseSize = { width: 800, height: 450 },
      onPositionChange,
    },
    ref
  ) => {
    // The Pixi.js `Sprite`
    const spriteRef = useRef<Sprite>(null)
    const [texture, setTexture] = useState(Texture.EMPTY)
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
    const [currentScale, setCurrentScale] = useState(initialScale)
    const [percentagePosition, setPercentagePosition] = useState({
      x: initialX,
      y: initialY,
    })
    const tweenRef = useRef<gsap.core.Tween | null>(null)

    // baseSize를 useMemo로 메모이제이션하여 불필요한 재생성 방지
    const memoizedBaseSize = useMemo(
      () => baseSize,
      [baseSize.width, baseSize.height]
    )

    // GSAP를 사용한 부드러운 애니메이션 함수
    const animateToPosition = useCallback(
      (newPosition: { x: number; y: number }) => {
        // 기존 트윈 취소
        if (tweenRef.current) {
          tweenRef.current.kill()
        }

        // 현재 위치를 시작점으로 설정
        const startPosition = { ...percentagePosition }

        // GSAP를 사용한 부드러운 애니메이션
        tweenRef.current = gsap.to(startPosition, {
          x: newPosition.x,
          y: newPosition.y,
          duration: 0.3, // 300ms
          ease: 'power2.out', // 자연스러운 이징
          onUpdate: () => {
            // React 상태 업데이트
            setPercentagePosition({ x: startPosition.x, y: startPosition.y })
          },
        })
      },
      [percentagePosition]
    )

    // 이동 함수들
    const moveLeft = useCallback(() => {
      const newX = Math.max(0, percentagePosition.x - 5)
      animateToPosition({ x: newX, y: percentagePosition.y })
    }, [animateToPosition, percentagePosition])

    const moveRight = useCallback(() => {
      const newX = Math.min(100, percentagePosition.x + 5)
      animateToPosition({ x: newX, y: percentagePosition.y })
    }, [animateToPosition, percentagePosition])

    const moveUp = useCallback(() => {
      const newY = Math.max(0, percentagePosition.y - 5)
      animateToPosition({ x: percentagePosition.x, y: newY })
    }, [animateToPosition, percentagePosition])

    const moveDown = useCallback(() => {
      const newY = Math.min(100, percentagePosition.y + 5)
      animateToPosition({ x: percentagePosition.x, y: newY })
    }, [animateToPosition, percentagePosition])

    const setPosition = useCallback((x: number, y: number) => {
      const clampedX = Math.max(0, Math.min(100, x))
      const clampedY = Math.max(0, Math.min(100, y))
      setPercentagePosition({ x: clampedX, y: clampedY })
    }, [])

    // 위치만 업데이트하는 함수 (percentagePosition 변경 시에만)
    const updatePosition = useCallback(() => {
      const width = window.innerWidth
      const height = (width * 9) / 16 // 16:9 비율

      // 위치 계산 - percentagePosition 사용
      const position = calculatePositionWithRatio(
        width,
        height,
        {
          x: percentagePosition.x,
          y: percentagePosition.y,
          type: positionType,
        },
        memoizedBaseSize
      )

      setCurrentPosition(position)

      // 위치 변경 콜백 호출
      if (onPositionChange) {
        onPositionChange(percentagePosition)
      }
    }, [percentagePosition, positionType, memoizedBaseSize, onPositionChange])

    // 스케일만 업데이트하는 함수 (화면 크기 변경 시에만)
    const updateScale = useCallback(() => {
      const width = window.innerWidth
      const height = (width * 9) / 16 // 16:9 비율

      // 스케일 계산
      const scale = calculateScale(width, height) * initialScale
      setCurrentScale(scale)
    }, [initialScale])

    // 위치 변경 시에만 위치 업데이트
    useEffect(() => {
      updatePosition()
    }, [updatePosition])

    // 화면 크기 변경 감지 및 스케일 자동 조정
    useEffect(() => {
      updateScale()
      window.addEventListener('resize', updateScale)

      return () => {
        window.removeEventListener('resize', updateScale)
        // GSAP 트윈 정리
        if (tweenRef.current) {
          tweenRef.current.kill()
        }
      }
    }, [updateScale])

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
      if (texture === Texture.EMPTY) {
        Assets.load('https://pixijs.com/assets/bunny.png').then(result => {
          setTexture(result)
        })
      }
    }, [texture])

    // ref를 통해 이동 함수들을 외부로 노출
    useImperativeHandle(
      ref,
      () => ({
        moveLeft,
        moveRight,
        moveUp,
        moveDown,
        getPosition: () => percentagePosition,
        setPosition,
      }),
      [moveLeft, moveRight, moveUp, moveDown, percentagePosition, setPosition]
    )

    return (
      <pixiSprite
        ref={spriteRef}
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
