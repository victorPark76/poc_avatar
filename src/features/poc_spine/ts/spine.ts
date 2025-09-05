import { Spine } from '@esotericsoftware/spine-pixi-v8'
import { Container } from 'pixi.js'
import { soundManager, type SoundConfig } from './soundManager'

// Class for handling the character Spine and its animations.
export class SpineBoy {
  private view: Container
  private spine: Spine
  private soundEventMap: Map<string, string> = new Map() // 애니메이션 이벤트 -> 사운드 매핑
  private lastAnimation: { name: string; loop: boolean } | null = null // 이전 애니메이션 저장

  constructor() {
    // Create the main view.
    this.view = new Container()

    // Create the Spine instance using the preloaded Spine asset aliases.
    // Note: Make sure 'spineSkeleton' and 'spineAtlas' assets are loaded before calling this
    this.spine = Spine.from({
      skeleton: 'spineSkeleton',
      atlas: 'spineAtlas',
      scale: 0.5,
      autoUpdate: true,
    })

    // Add the spine to the main view.
    this.view.addChild(this.spine)

    // 사운드 이벤트 리스너 설정
    this.setupSoundEvents()
  }

  // Getter for the view
  getView(): Container {
    return this.view
  }

  // Getter for the spine
  getSpine(): Spine {
    return this.spine
  }

  // Method to play animation
  playAnimation(
    animationName: string,
    loop: boolean = true,
    track: number = 0
  ) {
    if (this.spine && this.spine.state) {
      // 점프가 아닌 애니메이션은 이전 애니메이션으로 저장
      if (animationName !== 'jump') {
        this.lastAnimation = { name: animationName, loop }
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Spine 라이브러리 타입 정의 문제
      const result = this.spine.state.setAnimation(track, animationName, loop)

      // 점프 애니메이션일 때 완료 후 이전 애니메이션 복원 설정
      if (animationName === 'jump') {
        this.playSound('jump_pulse')
        this.setupJumpCompleteHandler(track)
      }

      return result
    }
    return null
  }

  // Method to stop animation
  stopAnimation(track: number = 0) {
    if (this.spine && this.spine.state) {
      this.spine.state.clearTrack(track)
    }
  }

  // 점프 애니메이션 완료 핸들러 설정
  private setupJumpCompleteHandler(track: number) {
    if (this.spine && this.spine.state) {
      // 점프 애니메이션 완료 감지
      const jumpCompleteListener = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        complete: (entry: any) => {
          // 점프 애니메이션이 완료되었을 때
          if (entry.animation && entry.animation.name === 'jump') {
            // 이전 애니메이션이 있으면 복원
            if (this.lastAnimation) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore - Spine 라이브러리 타입 정의 문제
              this.spine.state.setAnimation(
                track,
                this.lastAnimation.name,
                this.lastAnimation.loop
              )
            }
            // 리스너 제거
            this.spine.state.removeListener(jumpCompleteListener)
          }
        },
      }

      this.spine.state.addListener(jumpCompleteListener)
    }
  }

  // Method to set skin
  setSkin(skinName: string) {
    if (this.spine && this.spine.skeleton) {
      this.spine.skeleton.setSkinByName(skinName)
    }
  }

  // Method to set attachment
  setAttachment(slotName: string, attachmentName: string) {
    if (this.spine && this.spine.skeleton) {
      this.spine.skeleton.setAttachment(slotName, attachmentName)
    }
  }

  // Method to set bone position
  setBonePosition(boneName: string, x: number, y: number) {
    if (this.spine && this.spine.skeleton) {
      const bone = this.spine.skeleton.findBone(boneName)
      if (bone) {
        bone.x = x
        bone.y = y
      }
    }
  }

  // Method to get bone position
  getBonePosition(boneName: string): { x: number; y: number } | undefined {
    if (this.spine && this.spine.skeleton) {
      const bone = this.spine.skeleton.findBone(boneName)
      if (bone) {
        return { x: bone.x, y: bone.y }
      }
    }
    return undefined
  }

  // Method to set direction (flip horizontally)
  setDirection(direction: 'left' | 'right') {
    if (this.spine && this.spine.skeleton) {
      const scaleX = direction === 'left' ? -1 : 1
      this.spine.skeleton.scaleX = scaleX
    }
  }

  // Method to get current direction
  getDirection(): 'left' | 'right' {
    if (this.spine && this.spine.skeleton) {
      return this.spine.skeleton.scaleX < 0 ? 'left' : 'right'
    }
    return 'right'
  }

  // 사운드 이벤트 리스너 설정
  private setupSoundEvents() {
    if (this.spine && this.spine.state) {
      this.spine.state.addListener({
        event: (_entry, event) => {
          const soundName = this.soundEventMap.get(event.data.name)
          if (soundName) {
            soundManager.playSound(soundName)
          }
        },
      })
    }
  }

  // 사운드 이벤트 매핑 추가
  addSoundEvent(eventName: string, soundName: string) {
    this.soundEventMap.set(eventName, soundName)
  }

  // 사운드 이벤트 매핑 제거
  removeSoundEvent(eventName: string) {
    this.soundEventMap.delete(eventName)
  }

  // 모든 사운드 이벤트 매핑 제거
  clearSoundEvents() {
    this.soundEventMap.clear()
  }

  // 사운드 이벤트 매핑 가져오기
  getSoundEventMap(): Map<string, string> {
    return new Map(this.soundEventMap)
  }

  // 사운드 설정 로드
  async loadSoundConfigs(configs: SoundConfig[]) {
    await soundManager.loadSounds(configs)
  }

  // 사운드 재생 (직접)
  async playSound(soundName: string, volume?: number) {
    await soundManager.playSound(soundName, volume)
  }

  // 사운드 정지
  stopSound(soundName: string) {
    soundManager.stopSound(soundName)
  }

  // 모든 사운드 정지
  stopAllSounds() {
    soundManager.stopAllSounds()
  }

  // 사운드 활성화/비활성화
  setSoundEnabled(enabled: boolean) {
    soundManager.setEnabled(enabled)
  }

  // 마스터 볼륨 설정
  setMasterVolume(volume: number) {
    soundManager.setMasterVolume(volume)
  }

  // Method to destroy
  destroy() {
    // 사운드 정리
    this.stopAllSounds()
    this.clearSoundEvents()

    if (this.spine) {
      this.spine.destroy()
    }
    if (this.view) {
      this.view.destroy()
    }
  }
}
