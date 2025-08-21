import { Application, Assets, TilingSprite } from 'pixi.js'

export const loadBackground = async (
  app: Application,
  backgroundSrc: string,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    if (!app || !app.stage) {
      console.warn('디버깅용: PIXI 애플리케이션이 초기화되지 않았습니다.')
      return false
    }

    if (!backgroundSrc) {
      console.warn('배경 이미지 경로가 제공되지 않았습니다.')
      return false
    }

    const bgTexture = await Assets.load(backgroundSrc)
    if (!bgTexture) {
      console.error('배경 이미지를 로드할 수 없습니다.')
      return false
    }

    const backgroundSprite = new TilingSprite(bgTexture, width, height)

    // 배경 이미지 높이를 컨테이너 높이에 맞춤
    const scaleY = height / bgTexture.height
    backgroundSprite.tileScale.set(1, scaleY) // x축은 반복, y축은 높이에 맞춤

    app.stage.addChildAt(backgroundSprite, 0) // 맨 뒤에 배치
    return true
  } catch (error) {
    console.error('배경 이미지 로드 중 오류 발생:', error)
    return false
  }
}
