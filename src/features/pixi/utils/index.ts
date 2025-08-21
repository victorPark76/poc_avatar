// 랜덤 색상 생성
export function generateRandomColor(): number {
  return Math.random() * 0xffffff
}

// 두 점 사이의 거리 계산
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
