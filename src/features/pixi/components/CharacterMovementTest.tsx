import * as PIXI from 'pixi.js'
import { useEffect, useRef, useState } from 'react'
import { COLORS } from '../constants'

interface CharacterMovementTestProps {
  width?: number
  height?: number
}

/**
 * CharacterMovementTest 컴포넌트 - PIXI.js를 사용한 2D 캐릭터 움직임 테스트 구현
 * - 키보드 입력을 통한 캐릭터 이동 및 점프 기능 구현
 * - 그리드 배경, 장애물, 바닥선 등 기본적인 게임 환경 구성
 * - 캐릭터 위치 정보 표시 및 컨트롤 가이드 UI 제공
 * @param width - 캔버스 너비 (기본값: 800)
 * @param height - 캔버스 높이 (기본값: 600)
 */
export default function CharacterMovementTest({
  width = 800,
  height = 600,
}: CharacterMovementTestProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const characterRef = useRef<PIXI.Graphics | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [characterPosition, setCharacterPosition] = useState({ x: 400, y: 300 })
  const [keys, setKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!containerRef.current || isInitialized) return

    // PIXI 애플리케이션 생성
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })

    appRef.current = app
    containerRef.current.appendChild(app.view as unknown as Node)

    // 배경 그리드 생성
    createGrid(app, width, height)

    // 바닥선 생성
    const ground = new PIXI.Graphics()
    ground.beginFill(0x1e2a31)
    ground.drawRect(0, 0, width, 6)
    ground.y = height - 80
    app.stage.addChild(ground)

    // 캐릭터 생성 (초록색 사각형)
    const character = new PIXI.Graphics()
    character.beginFill(COLORS.SUCCESS)
    character.drawRect(-15, -15, 30, 30)
    character.endFill()
    character.x = characterPosition.x
    character.y = ground.y - 15 // 바닥 위에 위치
    characterRef.current = character
    app.stage.addChild(character)

    // 장애물 생성
    createObstacles(app, width, height)

    // 애니메이션 루프
    const gameLoop = () => {
      updateCharacterMovement(ground.y)
    }
    app.ticker.add(gameLoop)

    setIsInitialized(true)

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [width, height, isInitialized])

  // 그리드 생성
  /**
   * 그리드 배경을 생성하는 함수
   * - 캔버스에 50px 간격의 격자무늬 배경을 그림
   * - 세로선과 가로선을 반투명한 파란색으로 표시
   */
  const createGrid = (app: PIXI.Application, width: number, height: number) => {
    const grid = new PIXI.Graphics()
    grid.lineStyle(1, 0x333366, 0.3)

    // 세로선
    for (let x = 0; x <= width; x += 50) {
      grid.moveTo(x, 0)
      grid.lineTo(x, height)
    }

    // 가로선
    for (let y = 0; y <= height; y += 50) {
      grid.moveTo(0, y)
      grid.lineTo(width, y)
    }

    app.stage.addChild(grid)
  }

  // 장애물 생성
  /**
   * 장애물을 생성하는 함수
   * - 미리 정의된 위치와 크기에 따라 장애물을 생성
   * - 각 장애물은 SECONDARY 색상으로 표시됨
   */
  const createObstacles = (
    app: PIXI.Application,
    width: number,
    height: number
  ) => {
    const obstacles = [
      { x: 200, y: height - 120, width: 100, height: 20 },
      { x: 500, y: height - 200, width: 20, height: 100 },
      { x: 100, y: height - 150, width: 150, height: 20 },
    ]

    obstacles.forEach(obstacle => {
      const obs = new PIXI.Graphics()
      obs.beginFill(COLORS.SECONDARY)
      obs.drawRect(0, 0, obstacle.width, obstacle.height)
      obs.endFill()
      obs.x = obstacle.x
      obs.y = obstacle.y
      app.stage.addChild(obs)
    })
  }

  // 캐릭터 움직임 업데이트
  /**
   * 캐릭터의 움직임을 업데이트하는 함수
   * - 키보드 입력에 따른 캐릭터 이동 처리
   * - 중력 효과 적용
   * - 화면 경계 체크
   * @param groundY - 바닥선의 Y 좌표
   */
  const updateCharacterMovement = (groundY: number) => {
    if (!characterRef.current || !appRef.current) return

    const speed = 5
    let newX = characterRef.current.x
    let newY = characterRef.current.y

    if (keys.has('ArrowUp') || keys.has('w')) {
      // 점프 기능
      if (Math.abs(characterRef.current.y - (groundY - 15)) < 5) {
        newY -= 15
      }
    }
    if (keys.has('ArrowDown') || keys.has('s')) {
      // 아래로 이동 (제한적)
      newY = Math.min(newY + 2, groundY - 15)
    }
    if (keys.has('ArrowLeft') || keys.has('a')) {
      newX -= speed
    }
    if (keys.has('ArrowRight') || keys.has('d')) {
      newX += speed
    }

    // 경계 체크
    newX = Math.max(15, Math.min(width - 15, newX))
    newY = Math.max(15, Math.min(height - 15, newY))

    // 중력 적용
    if (newY < groundY - 15) {
      newY += 2
    }

    // 캐릭터 위치 업데이트
    characterRef.current.x = newX
    characterRef.current.y = newY
    setCharacterPosition({ x: newX, y: newY })
  }

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key.toLowerCase())
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg"
        style={{ width, height }}
      />

      {/* 컨트롤 가이드 */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded text-sm">
        <div className="font-bold mb-2">🎮 컨트롤</div>
        <div className="space-y-1 text-xs">
          <div>← → : 좌우 이동</div>
          <div>↑ W : 점프</div>
          <div>↓ S : 아래 이동</div>
        </div>
      </div>

      {/* 캐릭터 위치 정보 */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded text-sm">
        <div className="font-bold mb-2">📍 위치</div>
        <div className="text-xs">
          <div>X: {Math.round(characterPosition.x)}</div>
          <div>Y: {Math.round(characterPosition.y)}</div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>캐릭터 테스트 초기화 중...</div>
          </div>
        </div>
      )}
    </div>
  )
}
