import { Application, Ticker } from 'pixi.js'
import React, { useEffect, useRef } from 'react'
import { loadBackground } from '../../atoms/backgroundService'
import { loadClouds, type CloudConfig } from '../../atoms/cloudService'

type CloudDriftProps = {
  /** 구름 설정 배열 */
  clouds: CloudConfig[]
  /** 캔버스 크기 */
  width?: number
  height?: number
  /** 배경색(16진) */
  background?: number
  /** 배경 이미지 경로 */
  backgroundSrc?: string
}

const CloudDrift: React.FC<CloudDriftProps> = ({
  clouds = [],
  width = 640,
  height = 360,
  background = 0x87ceeb, // 하늘색
  backgroundSrc,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const tickerRef = useRef<Ticker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let app: Application | null = null

    try {
      app = new Application({
        width,
        height,
        backgroundColor: background,
        antialias: true,
        powerPreference: 'high-performance',
      })

      appRef.current = app
      containerRef.current.appendChild(app.view as HTMLCanvasElement)

      // PIXI 애플리케이션이 DOM에 추가된 후에 비동기 처리를 시작
      const initializeLayers = async () => {
        try {
          // PIXI 애플리케이션이 제대로 초기화되었는지 확인
          if (!app || !app.stage) {
            console.warn('디버깅용: PIXI 애플리케이션이 초기화되지 않았습니다.')
            return
          }

          // 배경 로드
          if (backgroundSrc) {
            const backgroundLoaded = await loadBackground(
              app,
              backgroundSrc,
              width,
              height
            )
            if (!backgroundLoaded) {
              console.warn('배경 로드에 실패했습니다.')
            }
          }

          // 구름 로드
          const cloudTicker = await loadClouds(app, clouds, width)
          if (cloudTicker) {
            tickerRef.current = cloudTicker
          } else {
            console.warn('구름 로드에 실패했습니다.')
          }
        } catch (error) {
          console.error('CloudDrift 초기화 중 오류 발생:', error)
        }
      }

      // DOM 추가 완료 후 비동기 초기화 시작
      setTimeout(() => {
        initializeLayers()
      }, 0)
    } catch (error) {
      console.error('PIXI 애플리케이션 생성 중 오류 발생:', error)
    }

    return () => {
      if (tickerRef.current) {
        tickerRef.current.stop()
      }
      if (app) {
        app.destroy(true, { children: true })
      }
      if (appRef.current) {
        appRef.current = null
      }
      tickerRef.current = null
    }
  }, [clouds, width, height, background, backgroundSrc])

  return <div ref={containerRef} style={{ width, height, lineHeight: 0 }} />
}

export default CloudDrift
