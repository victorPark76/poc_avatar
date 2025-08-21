import { useCallback, useEffect, useRef, useState } from 'react'
import { COLORS, SIZES } from '../constants'
import { PixiAppService } from '../services/PixiAppService'
import type { PixiCanvasProps } from '../types'

export function usePixiApp(props: PixiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const serviceRef = useRef<PixiAppService | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Pixi 애플리케이션 초기화
  const initializeApp = useCallback(async () => {
    if (!containerRef.current || isInitialized) return

    try {
      const service = new PixiAppService({
        width: props.width || 800,
        height: props.height || 600,
        backgroundColor: props.backgroundColor || 0x1099bb,
      })

      await service.initialize(containerRef.current)

      // 기본 객체들 생성
      const centerX = (props.width || 800) / 2
      const centerY = (props.height || 600) / 2

      // 움직이는 원
      service.createCircle(
        'moving-circle',
        centerX,
        centerY,
        SIZES.MEDIUM,
        COLORS.SECONDARY
      )

      // 인터랙티브 사각형
      service.createRectangle(
        'interactive-rect',
        centerX,
        centerY,
        SIZES.MEDIUM,
        SIZES.MEDIUM,
        COLORS.SUCCESS
      )

      // 텍스트
      service.createText('title-text', 'Pixi.js 테스트 페이지!', 20, 20)

      // 이벤트 리스너 설정
      service.addEventListener('interactive-rect', 'pointerdown', () => {
        const rect = service['objects'].get('interactive-rect') as any
        if (rect) {
          rect.tint = Math.random() * 0xffffff
        }
      })

      service.addEventListener('interactive-rect', 'pointerover', () => {
        const rect = service['objects'].get('interactive-rect') as any
        if (rect) {
          rect.scale.set(1.2)
        }
      })

      service.addEventListener('interactive-rect', 'pointerout', () => {
        const rect = service['objects'].get('interactive-rect') as any
        if (rect) {
          rect.scale.set(1)
        }
      })

      // 캔버스 클릭 이벤트
      service.setupCanvasClick((x, y) => {
        const randomColor = Math.random() * 0xffffff
        service.createCircle(
          `click-circle-${Date.now()}`,
          x,
          y,
          SIZES.SMALL,
          randomColor
        )

        // 3초 후 제거
        setTimeout(() => {
          const circle = service['objects'].get(`click-circle-${Date.now()}`)
          if (circle && service['app']) {
            service['app'].stage.removeChild(circle)
            service['objects'].delete(`click-circle-${Date.now()}`)
          }
        }, 3000)
      })

      // 애니메이션 시작
      service.startAnimation()

      serviceRef.current = service
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Pixi.js app:', error)
    }
  }, [props.width, props.height, props.backgroundColor, isInitialized])

  // 초기화
  useEffect(() => {
    initializeApp()
  }, [initializeApp])

  // 정리
  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy()
        serviceRef.current = null
      }
    }
  }, [])

  // 애니메이션 토글
  const toggleAnimation = useCallback(() => {
    if (serviceRef.current) {
      if (serviceRef.current['animationId']) {
        serviceRef.current.stopAnimation()
      } else {
        serviceRef.current.startAnimation()
      }
    }
  }, [])

  return {
    containerRef,
    isInitialized,
    toggleAnimation,
  }
}
