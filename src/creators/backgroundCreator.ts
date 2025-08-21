import { Application, Assets, TilingSprite } from 'pixi.js'

export const loadBackground = async (
  app: Application,
  backgroundSrc: string,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    if (!app || !app.stage) {
      // 개발 환경에서만 경고 표시
      if (process.env.NODE_ENV === 'development') {
        console.warn('PIXI 애플리케이션이 초기화되지 않았습니다.')
      }
      return false
    }

    if (!backgroundSrc) {
      // 개발 환경에서만 경고 표시
      if (process.env.NODE_ENV === 'development') {
        console.warn('배경 이미지 경로가 제공되지 않았습니다.')
      }
      return false
    }

    const bgTexture = await Assets.load(backgroundSrc)
    if (!bgTexture) {
      console.error('배경 이미지를 로드할 수 없습니다.')
      return false
    }

    // app.stage가 여전히 존재하는지 한 번 더 확인
    if (!app.stage) {
      console.error('app.stage가 null입니다. 배경을 추가할 수 없습니다.')
      return false
    }

    // 배경 이미지를 높이에 꽉 차게 설정하여 반복
    const backgroundSprite = new TilingSprite({
      texture: bgTexture,
      width: width,
      height: height,
    })

    // 높이에 맞게 스케일 조정 (가로는 반복, 세로는 높이에 맞춤)
    const scaleY = height / bgTexture.height
    backgroundSprite.tileScale.set(1, scaleY)

    // 배경을 화면에 배치
    backgroundSprite.x = 0
    backgroundSprite.y = 0

    app.stage.addChildAt(backgroundSprite, 0) // 맨 뒤에 배치
    return true
  } catch (error) {
    console.error('배경 이미지 로드 중 오류 발생:', error)
    return false
  }
}
