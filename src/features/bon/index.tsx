import * as PIXI from 'pixi.js'
import { Ticker } from 'pixi.js'
import { useEffect, useRef } from 'react'

/**
 * Simple bone-style walking animation without external assets.
 * - MIT-friendly (uses only PixiJS + vector Graphics)
 * - Limbs (arms/legs) swing while the character moves from start to end
 * - React 18 + TypeScript + PixiJS v7
 */
export default function WalkingBoneDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<PIXI.Application | null>(null)

  useEffect(() => {
    // ===== 1단계: PixiJS 애플리케이션 초기화 =====
    const app = new PIXI.Application({
      width: 800,
      height: 400,
      backgroundColor: 0x0f1115,
      backgroundAlpha: 1, // 투명도 경고 해결
      antialias: true,
      resolution: 1,
    })
    appRef.current = app

    // DOM에 캔버스 추가
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(app.view as HTMLCanvasElement)
    }

    // ===== 2단계: 캐릭터 컨테이너 및 지면 설정 =====
    // 캐릭터의 루트 컨테이너 생성 (전체 캐릭터를 담는 부모)
    const character = new PIXI.Container()
    character.x = 100 // 시작 X 위치
    character.y = 300 // 지면 기준선
    character.sortableChildren = true // 자식 요소들의 zIndex 정렬 활성화
    app.stage.addChild(character)

    const upperArmLen = 20
    const lowerArmLen = 26

    // 지면 선 그리기 (시각적 보조)
    const ground = new PIXI.Graphics()
    ground.lineStyle(2, 0x333944).moveTo(0, 302).lineTo(800, 302)
    app.stage.addChild(ground)

    // ===== 3단계: 뼈대 세그먼트 생성 헬퍼 함수 =====
    // 재사용 가능한 뼈대 조각을 만드는 함수
    const createBone = (length: number, thickness = 10, color = 0xffffff) => {
      const bone = new PIXI.Container()
      const g = new PIXI.Graphics()
      g.beginFill(color)
      g.drawRoundedRect(-thickness / 2, 0, thickness, length, thickness / 2)
      g.endFill()
      bone.addChild(g)
      // 관절(상단)을 피벗으로 설정. 회전은 (0,0)을 중심으로 발생
      // 뼈대의 중심점을 상단 관절 위치로 조정
      g.pivot.set(0, 0)
      return bone
    }

    // ===== 4단계: 몸통과 머리 생성 =====
    // 몸통 생성 (파란색 둥근 사각형)
    const torso = new PIXI.Container()
    const torsoG = new PIXI.Graphics()
    torsoG.beginFill(0x87cefa)
    torsoG.drawRoundedRect(-12, -60, 24, 60, 10)
    torsoG.endFill()
    torso.y = -100 // 지면 기준선 위로 몸통을 올림

    // 머리 생성 (살색 원형)
    const head = new PIXI.Graphics()
    head.beginFill(0xffe0bd)
    head.drawCircle(0, -80, 14)
    head.endFill()

    // ===== 5단계: 어깨와 엉덩이 앵커 포인트 설정 =====
    // 어깨와 엉덩이의 연결점을 몸통에 상대적으로 배치
    const leftShoulder = new PIXI.Container()
    leftShoulder.position.set(-14, -52) // 왼쪽 어깨 위치 (몸통 상단)
    const rightShoulder = new PIXI.Container()
    rightShoulder.position.set(14, -52) // 오른쪽 어깨 위치 (몸통 상단)

    const leftHip = new PIXI.Container()
    leftHip.position.set(-8, 0)
    const rightHip = new PIXI.Container()
    rightHip.position.set(8, 0)

    // ===== 6단계: 팔 생성 (상완 + 전완) =====
    // 팔은 두 개의 뼈대로 구성: 상완(위팔) + 전완(아래팔)
    // --- 왼쪽 팔 ---
    const upperArmL = createBone(upperArmLen, 8, 0xffffff) // 상완 (위팔)
    const lowerArmL = createBone(lowerArmLen, 7, 0xffffff) // 전완 (아래팔)

    lowerArmL.y = upperArmLen // 상완 끝에 전완 연결
    upperArmL.addChild(lowerArmL)
    // --- 오른쪽 팔 ---
    const upperArmR = createBone(upperArmLen, 8, 0xffffff) // 상완 (위팔)
    const lowerArmR = createBone(lowerArmLen, 7, 0xffffff) // 전완 (아래팔)

    lowerArmR.y = upperArmLen // 상완 끝에 전완 연결
    upperArmR.addChild(lowerArmR)

    // 팔이 어깨에 정확히 붙도록 위치 조정
    upperArmL.x = 0 // 어깨 컨테이너의 중심에 맞춤
    upperArmL.y = 0 // 어깨 컨테이너의 상단에 맞춤
    upperArmR.x = 0 // 어깨 컨테이너의 중심에 맞춤
    upperArmR.y = 0 // 어깨 컨테이너의 상단에 맞춤

    // --- 어깨에 팔 연결 ---
    leftShoulder.addChild(upperArmL)
    rightShoulder.addChild(upperArmR)

    // --- 팔 연결 완료 ---
    // (깊이 설정은 9단계에서 레이어별로 처리)

    // ===== 7단계: 다리 생성 (대퇴 + 정강이) =====
    // 다리도 두 개의 뼈대로 구성: 대퇴(허벅지) + 정강이(종아리)
    const thighLen = 34
    const shinLen = 34

    // --- 왼쪽 다리 ---
    const thighL = createBone(thighLen, 9, 0xffffff) // 대퇴 (허벅지)
    const shinL = createBone(shinLen, 9, 0xffffff) // 정강이 (종아리)
    shinL.y = thighLen // 대퇴 끝에 정강이 연결
    thighL.addChild(shinL)

    // --- 오른쪽 다리 ---
    const thighR = createBone(thighLen, 9, 0xffffff) // 대퇴 (허벅지)
    const shinR = createBone(shinLen, 9, 0xffffff) // 정강이 (종아리)
    shinR.y = thighLen // 대퇴 끝에 정강이 연결
    thighR.addChild(shinR)

    // --- 엉덩이에 다리 연결 ---
    leftHip.addChild(thighL)
    rightHip.addChild(thighR)

    // ===== 8단계: 발 생성 =====
    // 발은 간단한 마커로 생성
    const makeFoot = () => {
      const g = new PIXI.Graphics()
      g.beginFill(0xeeeeee)
      g.drawRoundedRect(-8, -2, 16, 6, 3)
      g.endFill()
      return g
    }

    // --- 왼쪽 발 ---
    const footL = makeFoot()
    footL.y = thighLen + shinLen // 정강이 끝에 발 연결
    shinL.addChild(footL)

    // --- 오른쪽 발 ---
    const footR = makeFoot()
    footR.y = thighLen + shinLen // 정강이 끝에 발 연결
    shinR.addChild(footR)

    // ===== 9단계: 전체 구조 조립 =====
    // 모든 부위를 몸통에 연결
    torso.addChild(rightShoulder, torsoG, head, leftShoulder, leftHip, rightHip)

    // 깊이 제어를 위해 모든 부위의 zIndex 명시적 설정
    leftShoulder.zIndex = -10 // 왼쪽 어깨(팔 포함)를 뒤로
    rightShoulder.zIndex = 10 // 오른쪽 어깨(팔 포함)를 앞으로
    torso.zIndex = 0 // 몸통을 중간으로 (기본값이지만 명시적 설정)

    // 몸통을 캐릭터에 추가 (어깨와 팔이 포함됨)
    character.addChild(torso)

    // ===== 10단계: 애니메이션 상태 및 루프 설정 =====
    const totalDuration = 5.0 // 시작에서 끝까지 걸리는 시간 (초)
    const startX = 0
    const endX = 700

    let elapsed = 0
    let currentSpeed = 1.0 // 현재 속도 배수 (1.0 = 기본 속도)
    const maxSpeed = 3.0 // 최대 속도 배수
    const acceleration = 0.05 // 가속도 (매 프레임마다 속도 증가량)

    // ===== 11단계: 메인 애니메이션 루프 =====
    const tickerCallback = (ticker: Ticker) => {
      const dt = ticker.deltaTime / 60 // ~60FPS로 정규화
      elapsed += dt

      // 가속도 적용: 시간이 지날수록 속도 증가
      currentSpeed = Math.min(currentSpeed + acceleration * dt, maxSpeed)

      // 캐릭터를 시작점에서 끝점으로 이동 (가속도 적용)
      const t = Math.min(elapsed / totalDuration, 1)
      character.x = startX + (endX - startX) * t

      // 걷는 동작을 시뮬레이션하는 상하 움직임
      const bob = Math.sin(elapsed * Math.PI * 2) * 2.5
      torso.y = -100 + bob

      // ===== 12단계: 팔다리 흔들림 애니메이션 =====
      // 흔들림 주기 (라디안) - 가속도 적용
      const walkSpeed = 3.5 * currentSpeed // 흔들림 속도 (가속도 적용)
      const phase = elapsed * walkSpeed

      // --- 팔 흔들림 (다리와 반대 방향) ---
      const armSwing = Math.sin(phase) * 0.8 // ~±45.8° (더 넓은 흔들림)
      const foreArmSwing = Math.sin(phase + Math.PI / 4) * 0.3

      // 왼쪽 팔 회전 (앞뒤로 자연스럽게)
      upperArmL.rotation = armSwing
      lowerArmL.rotation = foreArmSwing
      // 오른쪽 팔 회전 (왼쪽과 반대 방향으로)
      upperArmR.rotation = -armSwing
      lowerArmR.rotation = -foreArmSwing

      // ===== 13단계: 다리 흔들림 애니메이션 =====
      const legSwing = Math.sin(phase) * 0.6 // ~±34°
      const kneeSwing = Math.sin(phase + Math.PI / 3) * 0.5

      // --- 왼쪽 다리 회전 ---
      thighL.rotation = -legSwing
      shinL.rotation = Math.max(0, kneeSwing) // 정강이는 주로 앞쪽으로 유지

      // --- 오른쪽 다리 회전 (왼쪽과 반대) ---
      thighR.rotation = legSwing
      shinR.rotation = Math.max(0, -kneeSwing)

      // ===== 14단계: 애니메이션 리셋 =====
      // 끝에 도달하면 처음부터 다시 시작
      if (t >= 1) {
        elapsed = 0
        character.x = startX
        currentSpeed = 1.0 // 속도도 초기화
      }
    }

    // ticker에 콜백 추가
    Ticker.shared.add(tickerCallback)

    // ===== 15단계: 클린업 =====
    return () => {
      Ticker.shared.remove(tickerCallback)
      try {
        app.destroy(true, { children: true })
      } catch (error) {
        console.warn('PIXI 애플리케이션 정리 중 오류:', error)
      }
      appRef.current = null
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center gap-3 p-4">
      <h1 className="text-xl font-semibold">Simple Bone Walking (PixiJS)</h1>
      <p className="text-sm opacity-80">
        Arms/legs swing while moving from start to end. No assets required.
      </p>
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden shadow-lg"
      />
    </div>
  )
}
