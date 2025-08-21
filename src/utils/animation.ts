// PixiJS 라이브러리에서 필요한 클래스들을 가져옴
import { Container, Graphics } from 'pixi.js'

// 머리 애니메이션 함수 - 위아래로 움직이는 애니메이션
export const createHeadAnimation = (
  head: Graphics,
  headY: number,
  ratio: number
) => {
  return (time: number) => {
    const headAnimationRange = 3 * ratio
    head.y = headY + Math.sin(time) * headAnimationRange
  }
}

// 점프 애니메이션 함수 - 캐릭터 전체를 위아래로 움직이는 애니메이션
export const createJumpAnimation = (
  character: Container,
  y: number,
  ratio: number,
  randomStartTime: number
) => {
  return (time: number) => {
    const characterAnimationRange = 5 * ratio
    const characterTime = time * 2 + randomStartTime
    character.y = y + Math.sin(characterTime) * characterAnimationRange
  }
}

// 캐릭터 애니메이션 조합 함수 - 머리와 점프 애니메이션을 함께 실행
export const createCharacterAnimations = (
  character: Container,
  head: Graphics,
  headY: number,
  y: number,
  ratio: number,
  upperArmL: Container,
  lowerArmL: Container,
  upperArmR: Container,
  lowerArmR: Container,
  rank?: number // rank 정보 추가
) => {
  const randomStartTime = Math.random() * Math.PI * 2
  const armRandomStartTime = Math.random() * Math.PI * 2
  const armSpeed = 2.0 + Math.random() * 2.0 // 2.0 ~ 4.0 사이의 랜덤 속도
  const armRange = 0.6 + Math.random() * 0.4 // 0.6 ~ 1.0 사이의 랜덤 범위

  // 캐릭터마다 다른 방향 설정 (왼쪽, 오른쪽, 대각선 등)
  const directionType = Math.floor(Math.random() * 4) // 0: 기본, 1: 왼쪽, 2: 오른쪽, 3: 대각선
  const directionMultiplier =
    directionType === 1
      ? -1
      : directionType === 2
        ? 1
        : directionType === 3
          ? 0.5
          : 0.8

  const headAnim = createHeadAnimation(head, headY, ratio)
  const jumpAnim = createJumpAnimation(character, y, ratio, randomStartTime)

  return (time: number) => {
    headAnim(time)

    // rank가 1인 캐릭터는 점프 애니메이션을 건너뛰어 위치 고정
    if (rank !== 1) {
      jumpAnim(time)
    }

    // --- 팔 흔들림 (랜덤하게 자동으로 움직임) ---
    const armPhase = time * armSpeed + armRandomStartTime
    const armSwing = Math.sin(armPhase) * armRange
    const foreArmSwing = Math.sin(armPhase + Math.PI / 4) * (armRange * 0.4)

    // 로봇 춤 + 만세 동작 (다양한 패턴)
    const robotDancePhase = time * 1.5 + armRandomStartTime * 0.5
    const robotDanceIntensity = Math.sin(robotDancePhase * 0.3) * 0.5 + 0.5 // 0~1 사이 값

    // 만세 동작을 위한 별도 페이즈 (다른 속도로)
    const mansePhase = time * 0.8 + armRandomStartTime * 0.3
    const manseIntensity = Math.sin(mansePhase * 0.2) * 0.5 + 0.5 // 0~1 사이 값

    // 다양한 만세 패턴 (방향 다양성 적용)
    let leftArmAction = 0
    let rightArmAction = 0
    let leftForeArmAction = 0
    let rightForeArmAction = 0

    // rank가 1인 경우 항상 만세 자세로 고정
    if (rank === 1) {
      leftArmAction = Math.PI / 2 // 90도 위로
      rightArmAction = Math.PI / 2 // 90도 위로
      leftForeArmAction = Math.PI / 2 // 90도 위로
      rightForeArmAction = Math.PI / 2 // 90도 위로
    } else {
      // 기존 애니메이션 로직
      if (manseIntensity > 0.85) {
        // 두팔 만세 (양팔 모두 위로) - 방향 다양성 적용
        leftArmAction = (Math.PI / 2) * directionMultiplier
        rightArmAction = (Math.PI / 2) * directionMultiplier
        leftForeArmAction = (Math.PI / 2) * directionMultiplier
        rightForeArmAction = (Math.PI / 2) * directionMultiplier
      } else if (manseIntensity > 0.7) {
        // 왼팔만 만세 - 방향 다양성 적용
        leftArmAction = (Math.PI / 2) * directionMultiplier
        leftForeArmAction = (Math.PI / 2) * directionMultiplier
      } else if (manseIntensity > 0.55) {
        // 오른팔만 만세 - 방향 다양성 적용
        rightArmAction = (Math.PI / 2) * directionMultiplier
        rightForeArmAction = (Math.PI / 2) * directionMultiplier
      } else if (robotDanceIntensity > 0.7) {
        // 로봇 춤 (90도 접기) - 방향 다양성 적용
        leftArmAction = (Math.PI / 2) * directionMultiplier
        rightArmAction = (Math.PI / 2) * directionMultiplier
      }
    }

    // 기본 흔들림 + 액션 동작 (방향 다양성 적용, 아래로 내려가지 않도록 제한)
    const baseLeftSwing = Math.max(0, armSwing * directionMultiplier) // 아래로 내려가지 않음
    const baseRightSwing = Math.max(0, -armSwing * directionMultiplier) // 아래로 내려가지 않음
    const baseLeftForeSwing = Math.max(0, foreArmSwing * directionMultiplier) // 아래로 내려가지 않음
    const baseRightForeSwing = Math.max(0, -foreArmSwing * directionMultiplier) // 아래로 내려가지 않음

    const finalLeftArmSwing = baseLeftSwing + leftArmAction
    const finalRightArmSwing = baseRightSwing + rightArmAction
    const finalLeftForeArmSwing = baseLeftForeSwing + leftForeArmAction
    const finalRightForeArmSwing = baseRightForeSwing + rightForeArmAction

    // 왼쪽 팔 회전 (다양한 액션 + 자연스러운 흔들림)
    upperArmL.rotation = finalLeftArmSwing
    lowerArmL.rotation = finalLeftForeArmSwing
    // 오른쪽 팔 회전 (왼쪽과 반대 방향으로 + 다양한 액션)
    upperArmR.rotation = finalRightArmSwing
    lowerArmR.rotation = finalRightForeArmSwing
  }
}

// 애니메이션 타입 정의
export interface AnimationConfig {
  headAnimation: boolean
  jumpAnimation: boolean
  headSpeed: number
  jumpSpeed: number
  headRange: number
  jumpRange: number
}

// 설정 가능한 애니메이션 함수 (향후 확장용)
export const createConfigurableCharacterAnimations = (
  character: Container,
  head: Graphics,
  headY: number,
  y: number,
  ratio: number,
  config: Partial<AnimationConfig> = {}
) => {
  const {
    headAnimation = true,
    jumpAnimation = true,
    headSpeed = 1,
    jumpSpeed = 2,
    headRange = 3,
    jumpRange = 5,
  } = config

  const randomStartTime = Math.random() * Math.PI * 2

  return (time: number) => {
    if (headAnimation) {
      const headAnimationRange = headRange * ratio
      head.y = headY + Math.sin(time * headSpeed) * headAnimationRange
    }

    if (jumpAnimation) {
      const characterAnimationRange = jumpRange * ratio
      const characterTime = time * jumpSpeed + randomStartTime
      character.y = y + Math.sin(characterTime) * characterAnimationRange
    }
  }
}
