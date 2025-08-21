import { Application, Assets, Sprite, Ticker } from 'pixi.js'

export type CloudConfig = {
  /** 구름 이미지 경로 */
  src: string
  /** 구름의 수평 이동 범위(픽셀) */
  travel?: number
  /** 이동 속도(px/frame) */
  speed?: number
  /** 구름의 y 위치 */
  y?: number
  /** 구름의 시작 x(중앙 기준 오프셋) */
  startOffsetX?: number
  /** 구름 크기 조절 */
  scale?: number
}

export const loadClouds = async (
  app: Application,
  clouds: CloudConfig[],
  width: number
): Promise<Ticker | null> => {
  try {
    if (!app || !app.stage) {
      console.warn('디버깅용: PIXI 애플리케이션이 초기화되지 않았습니다.')
      return null
    }

    // clouds 배열이 비어있거나 undefined인 경우 처리
    if (!clouds || clouds.length === 0) {
      console.log('구름 설정이 없습니다.')
      return null
    }

    const cloudSprites: Array<{
      sprite: Sprite
      speed: number
      y: number
      originalY: number
    }> = []

    // 모든 구름 이미지 로드
    const cloudTextures = await Promise.all(
      clouds.map(async cloud => {
        try {
          return await Assets.load(cloud.src)
        } catch (error) {
          console.error(`구름 이미지 로드 실패: ${cloud.src}`, error)
          return null
        }
      })
    )

    // null인 텍스처 필터링
    const validTextures = cloudTextures.filter(tex => tex !== null)
    if (validTextures.length === 0) {
      console.error('로드할 수 있는 구름 이미지가 없습니다.')
      return null
    }

    // 각 구름 설정에 따라 스프라이트 생성
    clouds.forEach((cloudConfig, index) => {
      const tex = validTextures[index]
      if (!tex) return

      const cloud = new Sprite(tex)
      cloud.anchor.set(0.5)

      const y = cloudConfig.y ?? 120
      const speed = cloudConfig.speed ?? 1.2
      const startOffsetX = cloudConfig.startOffsetX ?? 0
      const scale = cloudConfig.scale ?? 1

      const centerX = width / 2 + startOffsetX

      cloud.y = y
      cloud.x = centerX

      // 구름 크기 조절
      const targetW = Math.min(220, tex.width) * scale
      const finalScale = targetW / tex.width
      cloud.scale.set(finalScale)

      app.stage.addChild(cloud)

      cloudSprites.push({
        sprite: cloud,
        speed,
        y,
        originalY: y,
      })
    })

    if (cloudSprites.length === 0) {
      console.warn('생성된 구름 스프라이트가 없습니다.')
      return null
    }

    // 애니메이션 틱 함수
    let t = 0
    const tick = (delta: number) => {
      t += 0.02 * delta

      cloudSprites.forEach(cloudData => {
        // 왼쪽에서 오른쪽으로 이동
        cloudData.sprite.x += cloudData.speed * delta

        // 화면 밖으로 나가면 왼쪽에서 다시 시작
        if (cloudData.sprite.x > width + 100) {
          cloudData.sprite.x = -100
        }

        // 살짝 떠다니는 효과
        cloudData.sprite.y =
          cloudData.originalY + Math.sin(t + cloudData.y * 0.1) * 4
      })
    }

    app.ticker.add(tick)
    return app.ticker
  } catch (error) {
    console.error('구름 초기화 중 오류 발생:', error)
    return null
  }
}
