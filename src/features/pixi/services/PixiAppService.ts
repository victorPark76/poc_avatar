import * as PIXI from 'pixi.js'
import { ANIMATION, COLORS } from '../constants'

export class PixiAppService {
  private app: PIXI.Application | null = null
  private objects: Map<string, PIXI.Graphics | PIXI.Text> = new Map()
  private animationId: number | null = null

  constructor(
    private config: {
      width: number
      height: number
      backgroundColor: number
    } = { width: 800, height: 600, backgroundColor: 0x1099bb }
  ) {}

  // 애플리케이션 초기화
  async initialize(container: HTMLDivElement): Promise<void> {
    this.app = new PIXI.Application({
      width: this.config.width,
      height: this.config.height,
      backgroundColor: this.config.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })

    container.appendChild(this.app.view as unknown as Node)
    this.setupBackground()
  }

  // 배경 설정
  private setupBackground(): void {
    if (!this.app) return

    const background = new PIXI.Graphics()
    background.beginFill(this.app.renderer.background.color)
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
    background.endFill()
    this.app.stage.addChild(background)
  }

  // 원 생성
  createCircle(
    id: string,
    x: number,
    y: number,
    radius: number,
    color: number = COLORS.SECONDARY
  ): void {
    if (!this.app) return

    const circle = new PIXI.Graphics()
    circle.beginFill(color)
    circle.drawCircle(0, 0, radius)
    circle.endFill()
    circle.x = x
    circle.y = y

    this.app.stage.addChild(circle)
    this.objects.set(id, circle)
  }

  // 사각형 생성
  createRectangle(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number = COLORS.SUCCESS
  ): void {
    if (!this.app) return

    const rectangle = new PIXI.Graphics()
    rectangle.beginFill(color)
    rectangle.drawRect(-width / 2, -height / 2, width, height)
    rectangle.endFill()
    rectangle.x = x
    rectangle.y = y

    this.app.stage.addChild(rectangle)
    this.objects.set(id, rectangle)
  }

  // 텍스트 생성
  createText(id: string, text: string, x: number, y: number): void {
    if (!this.app) return

    const textObject = new PIXI.Text(text, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: COLORS.WHITE,
      stroke: COLORS.BLACK,
      strokeThickness: 4,
    })
    textObject.x = x
    textObject.y = y

    this.app.stage.addChild(textObject)
    this.objects.set(id, textObject)
  }

  // 애니메이션 시작
  startAnimation(): void {
    if (!this.app || this.animationId) return

    let time = 0
    this.animationId = this.app.ticker.add(() => {
      time += ANIMATION.SPEED

      // 움직이는 원 애니메이션
      const circle = this.objects.get('moving-circle') as PIXI.Graphics
      if (circle) {
        circle.x =
          this.app!.screen.width / 2 + Math.sin(time) * ANIMATION.AMPLITUDE
        circle.y =
          this.app!.screen.height / 2 + Math.cos(time) * ANIMATION.AMPLITUDE
        circle.rotation += ANIMATION.ROTATION_SPEED
      }
    })
  }

  // 애니메이션 정지
  stopAnimation(): void {
    if (this.animationId && this.app) {
      this.app.ticker.remove(this.animationId)
      this.animationId = null
    }
  }

  // 이벤트 리스너 추가
  addEventListener(
    id: string,
    eventType: string,
    callback: (event: any) => void
  ): void {
    const object = this.objects.get(id)
    if (object) {
      object.eventMode = 'static'
      object.on(eventType, callback)
    }
  }

  // 캔버스 클릭 이벤트 설정
  setupCanvasClick(callback: (x: number, y: number) => void): void {
    if (!this.app) return

    this.app.stage.eventMode = 'static'
    this.app.stage.on('pointerdown', event => {
      callback(event.data.global.x, event.data.global.y)
    })
  }

  // 애플리케이션 정리
  destroy(): void {
    this.stopAnimation()
    if (this.app) {
      this.app.destroy(true)
      this.app = null
    }
    this.objects.clear()
  }
}
