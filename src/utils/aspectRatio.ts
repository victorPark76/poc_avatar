/**
 * Aspect Ratio 관련 유틸리티 함수들
 */

export interface AspectRatioConfig {
  width: number
  height: number
  ratio: number
}

export interface SizeCalculation {
  width: number
  height: number
  scale: number
}

/**
 * 16:9 비율 설정
 */
export const ASPECT_RATIO_16_9 = {
  width: 16,
  height: 9,
  ratio: 16 / 9,
}

/**
 * 4:3 비율 설정
 */
export const ASPECT_RATIO_4_3 = {
  width: 4,
  height: 3,
  ratio: 4 / 3,
}

/**
 * 21:9 비율 설정
 */
export const ASPECT_RATIO_21_9 = {
  width: 21,
  height: 9,
  ratio: 21 / 9,
}

/**
 * 주어진 넓이를 기준으로 특정 비율에 맞는 높이를 계산
 * @param width - 기준 넓이
 * @param aspectRatio - 비율 설정 (기본값: 16:9)
 * @returns 계산된 높이
 */
export const calculateHeightByWidth = (
  width: number,
  aspectRatio: AspectRatioConfig = ASPECT_RATIO_16_9
): number => {
  return (width * aspectRatio.height) / aspectRatio.width
}

/**
 * 주어진 높이를 기준으로 특정 비율에 맞는 넓이를 계산
 * @param height - 기준 높이
 * @param aspectRatio - 비율 설정 (기본값: 16:9)
 * @returns 계산된 넓이
 */
export const calculateWidthByHeight = (
  height: number,
  aspectRatio: AspectRatioConfig = ASPECT_RATIO_16_9
): number => {
  return (height * aspectRatio.width) / aspectRatio.height
}

/**
 * 기준 크기 대비 현재 크기의 스케일을 계산
 * @param currentWidth - 현재 넓이
 * @param currentHeight - 현재 높이
 * @param baseWidth - 기준 넓이 (기본값: 800)
 * @param baseHeight - 기준 높이 (기본값: 450)
 * @returns 스케일 값
 */
export const calculateScale = (
  currentWidth: number,
  currentHeight: number,
  baseWidth: number = 800,
  baseHeight: number = 450
): number => {
  return Math.min(currentWidth / baseWidth, currentHeight / baseHeight)
}

/**
 * 16:9 비율로 컨테이너 크기를 조정
 * @param container - HTML 요소
 * @param aspectRatio - 비율 설정 (기본값: 16:9)
 * @returns 조정된 크기 정보
 */
export const adjustContainerToAspectRatio = (
  container: HTMLElement,
  aspectRatio: AspectRatioConfig = ASPECT_RATIO_16_9
): SizeCalculation => {
  const width = container.offsetWidth || window.innerWidth
  const height = calculateHeightByWidth(width, aspectRatio)

  // 컨테이너 스타일 설정
  container.style.height = `${height}px`
  container.style.width = '100%'
  container.style.minHeight = `${height}px`
  container.style.maxHeight = `${height}px`

  return {
    width,
    height,
    scale: calculateScale(width, height),
  }
}

/**
 * 특정 비율에 맞는 위치 계산 (퍼센트 기반)
 * @param containerWidth - 컨테이너 넓이
 * @param containerHeight - 컨테이너 높이
 * @param xPercent - X 위치 퍼센트 (0-100)
 * @param yPercent - Y 위치 퍼센트 (0-100)
 * @returns 계산된 위치
 */
export const calculatePositionByPercentage = (
  containerWidth: number,
  containerHeight: number,
  xPercent: number,
  yPercent: number
): { x: number; y: number } => {
  return {
    x: (containerWidth * xPercent) / 100,
    y: (containerHeight * yPercent) / 100,
  }
}

/**
 * 비율에 맞춰 위치를 계산하는 고급 함수
 * @param containerWidth - 컨테이너 넓이
 * @param containerHeight - 컨테이너 높이
 * @param position - 위치 설정 (퍼센트 또는 절대값)
 * @param baseSize - 기준 크기 (기본값: 800x450)
 * @returns 계산된 위치
 */
export const calculatePositionWithRatio = (
  containerWidth: number,
  containerHeight: number,
  position: PositionConfig,
  baseSize: { width: number; height: number } = { width: 800, height: 450 }
): { x: number; y: number } => {
  const { x, y, type = 'percentage' } = position

  if (type === 'percentage') {
    return calculatePositionByPercentage(containerWidth, containerHeight, x, y)
  } else if (type === 'absolute') {
    // 절대값을 비율에 맞춰 스케일링
    const scaleX = containerWidth / baseSize.width
    const scaleY = containerHeight / baseSize.height
    const scale = Math.min(scaleX, scaleY)

    return {
      x: x * scale,
      y: y * scale,
    }
  } else if (type === 'ratio') {
    // 비율 기반 위치 계산 (예: 0.5는 중앙)
    return {
      x: containerWidth * x,
      y: containerHeight * y,
    }
  }

  return { x: 0, y: 0 }
}

/**
 * 위치 설정을 위한 설정 객체 타입
 */
export interface PositionConfig {
  x: number
  y: number
  type?: 'percentage' | 'absolute' | 'ratio'
}

/**
 * 16:9 비율에서의 일반적인 위치 상수들 (퍼센트 기반)
 */
export const POSITION_PRESETS = {
  CENTER: { x: 50, y: 50, type: 'percentage' as const },
  LEFT_TOP: { x: 15, y: 30, type: 'percentage' as const },
  RIGHT_TOP: { x: 85, y: 30, type: 'percentage' as const },
  LEFT_BOTTOM: { x: 15, y: 70, type: 'percentage' as const },
  RIGHT_BOTTOM: { x: 85, y: 70, type: 'percentage' as const },
  BOTTOM_CENTER: { x: 50, y: 70, type: 'percentage' as const },
  LEFT_CENTER: { x: 15, y: 50, type: 'percentage' as const },
  RIGHT_CENTER: { x: 85, y: 50, type: 'percentage' as const },
  TOP_CENTER: { x: 50, y: 30, type: 'percentage' as const },
} as const

/**
 * 절대값 기반 위치 프리셋 (800x450 기준)
 */
export const ABSOLUTE_POSITION_PRESETS = {
  CENTER: { x: 400, y: 225, type: 'absolute' as const },
  LEFT_TOP: { x: 120, y: 135, type: 'absolute' as const },
  RIGHT_TOP: { x: 680, y: 135, type: 'absolute' as const },
  LEFT_BOTTOM: { x: 120, y: 315, type: 'absolute' as const },
  RIGHT_BOTTOM: { x: 680, y: 315, type: 'absolute' as const },
  BOTTOM_CENTER: { x: 400, y: 315, type: 'absolute' as const },
} as const

/**
 * 비율 기반 위치 프리셋 (0.0 ~ 1.0)
 */
export const RATIO_POSITION_PRESETS = {
  CENTER: { x: 0.5, y: 0.5, type: 'ratio' as const },
  LEFT_TOP: { x: 0.15, y: 0.3, type: 'ratio' as const },
  RIGHT_TOP: { x: 0.85, y: 0.3, type: 'ratio' as const },
  LEFT_BOTTOM: { x: 0.15, y: 0.7, type: 'ratio' as const },
  RIGHT_BOTTOM: { x: 0.85, y: 0.7, type: 'ratio' as const },
  BOTTOM_CENTER: { x: 0.5, y: 0.7, type: 'ratio' as const },
} as const
