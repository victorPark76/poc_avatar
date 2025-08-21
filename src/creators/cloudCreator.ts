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
      try {
        const tex = validTextures[index]
        if (!tex) return

        const cloud = new Sprite(tex)
        cloud.anchor.set(0.5)

        // width를 기준으로 상대비율 계산 (4:3 비율)
        const baseWidth = 800 // 기준 너비 (4:3)
        const ratio = width / baseWidth

        // y 위치를 상대비율로 계산 (기본값: 화면 높이의 17%)
        const y = cloudConfig.y ?? Math.round(width * (9 / 16) * 0.17)
        const speed = (cloudConfig.speed ?? 1.2) * ratio // 속도도 비율에 맞춰 조정
        const startOffsetX = (cloudConfig.startOffsetX ?? 0) * ratio // 오프셋도 비율에 맞춰 조정
        const scale = (cloudConfig.scale ?? 1) * ratio // 크기도 비율에 맞춰 조정

        const centerX = width / 2 + startOffsetX

        cloud.y = y
        cloud.x = centerX

        // 구름 크기를 상대비율로 조절
        const baseSize = Math.min(220, tex.width) * scale
        const finalScale = baseSize / tex.width
        cloud.scale.set(finalScale)

        // app.stage가 존재하는지 한 번 더 확인
        if (app.stage) {
          app.stage.addChild(cloud)
        } else {
          console.error('app.stage가 null입니다. 구름을 추가할 수 없습니다.')
          return
        }

        cloudSprites.push({
          sprite: cloud,
          speed,
          y,
          originalY: y,
        })
      } catch (error) {
        console.error(`구름 ${index} 생성 중 오류:`, error)
      }
    })

    if (cloudSprites.length === 0) {
      console.warn('생성된 구름 스프라이트가 없습니다.')
      return null
    }

    // 구름 애니메이션을 위한 ticker 생성
    const cloudTicker = new Ticker()
    cloudTicker.add(() => {
      cloudSprites.forEach(cloudData => {
        const { sprite, speed, originalY } = cloudData

        // 구름을 왼쪽으로 이동
        sprite.x -= speed

        // 구름이 화면 왼쪽 끝에 도달하면 오른쪽 끝으로 이동
        if (sprite.x < -sprite.width / 2) {
          sprite.x = width + sprite.width / 2
        }

        // 구름을 위아래로 살짝 움직이는 애니메이션 추가
        const time = Date.now() * 0.002
        sprite.y = originalY + Math.sin(time) * 2
      })
    })

    cloudTicker.start()
    return cloudTicker
  } catch (error) {
    console.error('구름 로드 중 오류 발생:', error)
    return null
  }
}
