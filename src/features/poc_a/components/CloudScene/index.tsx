import { loadBackground } from '@/creators/backgroundCreator'
import { createCharacter } from '@/creators/characterCreator'
import { loadClouds, type CloudConfig } from '@/creators/cloudCreator'
import { useCharacterStore } from '@/stores/characterStore'
import { Application, Container, Ticker } from 'pixi.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type CloudDriftProps = {
  /** 구름 설정 배열 */
  clouds: CloudConfig[]
  /** 배경색(16진) */
  background?: number
  /** 배경 이미지 경로 */
  backgroundSrc?: string
}

const CloudDrift: React.FC<CloudDriftProps> = ({
  clouds = [],
  background = 0x87ceeb, // 하늘색
  backgroundSrc,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const tickerRef = useRef<Ticker | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const characterRefs = useRef<Map<string, Container>>(new Map()) // 캐릭터 참조를 저장
  const characterTickersRef = useRef<Map<string, Ticker>>(new Map()) // 캐릭터별 ticker 참조를 저장
  const [isAnimating, setIsAnimating] = useState(false)
  const [localWidth, setLocalWidth] = useState(800) // 로컬 상태로 관리
  const [localHeight, setLocalHeight] = useState(600) // 로컬 상태로 관리
  const characters = useCharacterStore(state => state.characters)

  // rank 1 캐릭터 애니메이션 함수
  const animateRankOneCharacter = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // rank 1인 캐릭터 찾기
    const rankOneCharacter = characters.find(char => char.rank === 1)
    if (!rankOneCharacter) {
      console.log('rank 1인 캐릭터를 찾을 수 없습니다.')
      setIsAnimating(false)
      return
    }

    const characterRef = characterRefs.current.get(rankOneCharacter.name)
    if (!characterRef) {
      console.log('rank 1 캐릭터의 참조를 찾을 수 없습니다.')
      setIsAnimating(false)
      return
    }

    // 1등 캐릭터의 개별 ticker만 중지하여 점프 애니메이션 방지
    const characterTicker = characterTickersRef.current.get(
      rankOneCharacter.name
    )
    if (characterTicker) {
      characterTicker.stop()
    }

    // 현재 위치에서 30% 위로 이동하는 애니메이션
    const startY = characterRef.y
    const targetY = startY - localHeight * 0.3 // 30% 위로
    const duration = 2000 // 2초
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // easeOutQuart 이징 함수 적용
      const easeProgress = 1 - Math.pow(1 - progress, 4)

      characterRef.y = startY - easeProgress * (localHeight * 0.3)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // 애니메이션 완료
        characterRef.y = targetY
        setIsAnimating(false)
        console.log('rank 1 캐릭터 애니메이션 완료')

        // ticker를 다시 시작하지 않음 - 1등 캐릭터가 이동한 자리를 유지
        // 다른 캐릭터들의 애니메이션도 함께 중지되어 1등의 위치가 고정됨
      }
    }

    requestAnimationFrame(animate)
  }

  // 리사이즈 핸들러 - 스토어 업데이트 없이 로컬 상태만 관리
  const handleResize = useCallback(() => {
    if (!containerRef.current || !appRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight

    if (containerWidth > 0 && containerHeight > 0) {
      // 로컬 상태만 업데이트
      setLocalWidth(containerWidth)
      setLocalHeight(containerHeight)

      // PixiJS renderer만 리사이즈
      try {
        if (appRef.current.renderer) {
          appRef.current.renderer.resize(containerWidth, containerHeight)
          console.log(
            'PixiJS renderer 크기 조정 완료:',
            containerWidth,
            containerHeight
          )
        }
      } catch (error) {
        console.error('PixiJS renderer 크기 조정 오류:', error)
      }
    }
  }, [])

  // ResizeObserver를 별도의 useEffect로 분리하여 무한루프 방지
  useEffect(() => {
    if (!containerRef.current) return

    // ResizeObserver로 컨테이너 크기 변화 감지
    resizeObserverRef.current = new ResizeObserver(handleResize)

    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current)
    }

    // 초기 크기 설정
    handleResize()

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [handleResize]) // handleResize만 의존성으로 추가

  // PixiJS 초기화를 위한 useEffect
  useEffect(() => {
    if (!containerRef.current) return

    // 이미 초기화 중이거나 완료된 경우 중복 실행 방지
    if (appRef.current) {
      console.log('이미 PixiJS 애플리케이션이 초기화되어 있습니다.')
      return
    }

    let app: Application | null = null

    // PixiJS 초기화를 위한 비동기 함수
    const initializePixiJS = async () => {
      try {
        console.log('PixiJS Application 생성 시작...')

        // 기존 canvas가 있는지 확인하고 제거
        const existingCanvas = containerRef.current?.querySelector('canvas')
        if (existingCanvas) {
          existingCanvas.remove()
          console.log('기존 canvas 제거됨')
        }

        // PixiJS v8에서 Application 생성 - init() 메서드 사용
        app = new Application()

        try {
          await (
            app as unknown as {
              init(options: Record<string, unknown>): Promise<void>
            }
          ).init({
            width: localWidth,
            height: localHeight,
            backgroundColor: background,
            backgroundAlpha: 1,
            antialias: true,
            powerPreference: 'high-performance',
            hello: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            transparent: false,
          })
        } catch (error) {
          console.error('PixiJS init 실패:', error)
          if (app) {
            app.destroy()
          }
          return
        }

        // 생성된 canvas를 DOM에 추가
        if (app.view) {
          const pixiCanvas = app.view as HTMLCanvasElement
          pixiCanvas.style.display = 'block'
          if (containerRef.current) {
            containerRef.current.appendChild(pixiCanvas)
            console.log('PixiJS canvas DOM에 추가 완료')
          }
        }

        console.log('PixiJS Application 생성됨:', app)
        console.log('app.stage:', app.stage)
        console.log('app.renderer:', app.renderer)
        console.log('app.view:', app.view)

        appRef.current = app

        // PIXI 애플리케이션이 DOM에 추가된 후에 비동기 처리를 시작
        const initializeLayers = async () => {
          try {
            // PIXI 애플리케이션이 제대로 초기화되었는지 확인
            if (!app || !app.stage) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('PIXI 애플리케이션이 초기화되지 않았습니다.')
              }
              return
            }

            // 추가 안전성 검사
            if (!containerRef.current) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('컨테이너 참조가 없습니다.')
              }
              return
            }

            // PIXI 앱이 DOM에 제대로 추가되었는지 확인
            const pixiCanvas = containerRef.current.querySelector('canvas')
            if (!pixiCanvas) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('PIXI 캔버스가 DOM에 추가되지 않았습니다.')
              }
              return
            }

            // 배경 로드
            if (backgroundSrc) {
              try {
                const backgroundLoaded = await loadBackground(
                  app,
                  backgroundSrc,
                  localWidth,
                  localHeight
                )
                if (!backgroundLoaded) {
                  console.warn('배경 로드에 실패했습니다.')
                } else {
                  console.log('배경 로드 성공')
                }
              } catch (error) {
                console.error('배경 로드 중 오류:', error)
              }
            }

            // 구름 로드
            try {
              const cloudTicker = await loadClouds(app, clouds, localWidth)
              if (cloudTicker) {
                tickerRef.current = cloudTicker
                console.log('구름 로드 성공')
              } else {
                console.warn('구름 로드에 실패했습니다.')
              }
            } catch (error) {
              console.error('구름 로드 중 오류:', error)
            }

            console.log('characters', characters)

            // 캐릭터 생성 및 ticker에 추가
            if (characters && characters.length > 0 && app) {
              characters.forEach((character, index) => {
                try {
                  // 화면 너비를 균등하게 분할하여 가로로 정렬
                  const characterSpacing = localWidth / (characters.length + 1) // 양 끝 여백을 위해 +1
                  const characterX = characterSpacing * (index + 1) // 첫 번째 캐릭터는 1번째 위치부터

                  // 캐릭터 설정 (위치, 색상 등)
                  const characterConfig = {
                    x: characterX,
                    y: localHeight * 0.85, // 화면 높이의 85% 위치에 배치
                    width: 50,
                    height: 50,
                    name: character.name,
                    face: character.face,
                    body: character.body,
                    type: character.type,
                  }

                  const characterInstance = createCharacter(
                    app!,
                    characterConfig,
                    localWidth
                  )

                  if (characterInstance) {
                    characterRefs.current.set(
                      character.name,
                      characterInstance.character
                    )
                    characterTickersRef.current.set(
                      character.name,
                      characterInstance.characterTicker
                    )

                    // 개별 ticker 시작
                    characterInstance.characterTicker.start()
                    console.log(`캐릭터 ${character.name} 생성 성공`)
                  } else {
                    console.warn(`캐릭터 ${character.name} 생성 실패`)
                  }
                } catch (error) {
                  console.error(`캐릭터 ${character.name} 생성 중 오류:`, error)
                }
              })
            }

            console.log('PIXI 레이어 초기화 완료')
          } catch (error) {
            console.error('CloudDrift 초기화 중 오류 발생:', error)
          }
        }

        // DOM 추가 완료 후 비동기 초기화 시작 - PIXI 앱이 완전히 준비될 때까지 대기
        setTimeout(() => {
          initializeLayers()
        }, 100)
      } catch (error) {
        console.error('PIXI 애플리케이션 생성 중 오류 발생:', error)
        if (app) {
          app.destroy()
        }
      }
    }

    // PixiJS 초기화 시작
    initializePixiJS()

    return () => {
      console.log('PixiJS 애플리케이션 정리 시작...')

      if (tickerRef.current) {
        tickerRef.current.stop()
        tickerRef.current = null
      }

      // 개별 character ticker들 정리
      characterTickersRef.current.forEach(ticker => {
        ticker.stop()
      })
      characterTickersRef.current.clear()

      // canvas 요소 정리
      if (containerRef.current) {
        const canvasElements = containerRef.current.querySelectorAll('canvas')
        canvasElements.forEach(canvas => {
          canvas.remove()
        })
        console.log('Canvas 요소들 정리 완료')
      }

      if (app) {
        try {
          app.destroy(true, { children: true })
          console.log('PixiJS 애플리케이션 정리 완료')
        } catch (error) {
          console.warn('PIXI 애플리케이션 정리 중 오류:', error)
        }
      }

      // 참조 정리
      appRef.current = null
      app = null
    }
  }, [clouds, background, backgroundSrc, characters]) // width, height 제거하여 무한루프 방지

  return (
    <>
      <div>
        {/* PixiJS 캔버스 컨테이너 */}
        <div ref={containerRef} style={{ lineHeight: 0 }} />
        {/* 하단 결과확인 버튼 */}
      </div>
      <div className="mt-5 text-center p-5 bg-gray-50 rounded-lg shadow-sm">
        <button
          onClick={animateRankOneCharacter}
          disabled={isAnimating}
          className={`px-6 py-3 border-none rounded-md cursor-pointer text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isAnimating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 active:bg-blue-700'
          } text-white`}
        >
          {isAnimating ? '애니메이션 중...' : '순위확인'}
        </button>
        <p className="mt-2.5 text-sm text-gray-500 italic">
          캐릭터 애니메이션 결과를 확인하세요
        </p>
      </div>
    </>
  )
}

export default CloudDrift
