/**
 * Spine 애니메이션용 사운드 매니저
 * 애니메이션 이벤트와 사운드를 연결하고 재생을 관리합니다.
 */

import { soundGenerator } from './soundGenerator'

export interface SoundConfig {
  name: string
  src: string
  volume?: number
  loop?: boolean
  preload?: boolean
}

export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private isEnabled: boolean = false
  private masterVolume: number = 0.7

  constructor() {
    // 브라우저 자동 재생 정책에 대응
    this.initializeAudioContext()
    this.initializeSoundGenerator()
  }

  /**
   * 오디오 컨텍스트 초기화 (자동 재생 정책 대응)
   */
  private async initializeAudioContext() {
    try {
      // 사용자 상호작용 후 오디오 컨텍스트 활성화
      document.addEventListener('click', this.activateAudioContext.bind(this), {
        once: true,
      })
      document.addEventListener(
        'touchstart',
        this.activateAudioContext.bind(this),
        { once: true }
      )
    } catch (error) {
      console.warn('Audio context initialization failed:', error)
    }
  }

  private async activateAudioContext() {
    try {
      // 모든 사운드의 오디오 컨텍스트 활성화
      for (const audio of this.sounds.values()) {
        if (audio.paused) {
          await audio.play()
          audio.pause()
        }
      }
      // 사운드 생성기도 활성화
      await soundGenerator.activateAudioContext()
    } catch (error) {
      console.warn('Audio context activation failed:', error)
    }
  }

  /**
   * 사운드 생성기 초기화
   */
  private initializeSoundGenerator() {
    try {
      // 사용자 상호작용 후 사운드 생성기 활성화
      document.addEventListener(
        'click',
        () => {
          soundGenerator.activateAudioContext()
        },
        { once: true }
      )
      document.addEventListener(
        'touchstart',
        () => {
          soundGenerator.activateAudioContext()
        },
        { once: true }
      )
    } catch (error) {
      console.warn('Sound generator initialization failed:', error)
    }
  }

  /**
   * 사운드 등록
   */
  async loadSound(config: SoundConfig): Promise<void> {
    try {
      // 먼저 파일 존재 여부 확인
      const fileExists = await this.checkFileExists(config.src)
      if (!fileExists) {
        // console.log(`📁 File not found, skipping: ${config.src}`)
        return
      }

      const audio = new Audio(config.src)
      audio.volume = (config.volume || 1) * this.masterVolume
      audio.loop = config.loop || false
      audio.preload = config.preload !== false ? 'auto' : 'none'

      // 로드 완료 대기 (타임아웃 추가)
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Sound load timeout: ${config.src}`))
        }, 3000) // 3초 타임아웃

        audio.addEventListener(
          'canplaythrough',
          () => {
            clearTimeout(timeout)
            resolve()
          },
          { once: true }
        )

        audio.addEventListener(
          'error',
          e => {
            clearTimeout(timeout)
            reject(new Error(`Failed to load sound: ${config.src} - ${e}`))
          },
          { once: true }
        )
      })

      this.sounds.set(config.name, audio)
      console.log(`✅ Sound loaded: ${config.name}`)
    } catch {
      console.log(
        `📁 Sound file not available, will use Web Audio API: ${config.name}`
      )
      // 실패한 사운드는 등록하지 않음
    }
  }

  /**
   * 파일 존재 여부 확인
   */
  private async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * 여러 사운드 일괄 등록
   */
  async loadSounds(configs: SoundConfig[]): Promise<void> {
    const loadPromises = configs.map(config => this.loadSound(config))
    await Promise.allSettled(loadPromises)
  }

  /**
   * 사운드 재생
   */
  async playSound(name: string, volume?: number): Promise<void> {
    if (!this.isEnabled) {
      // console.log(`🔇 Sound disabled, skipping: ${name}`)
      return
    }

    const audio = this.sounds.get(name)
    if (!audio) {
      // console.log(`🔍 Sound not found: ${name}, trying sound generator...`)
      // 사운드 파일이 없으면 사운드 생성기 사용
      await this.playGeneratedSound(name, volume)
      return
    }

    try {
      // 볼륨 설정
      if (volume !== undefined) {
        audio.volume = volume * this.masterVolume
      }

      // 재생
      audio.currentTime = 0
      await audio.play()
      // console.log(`🔊 Playing sound: ${name}`)
    } catch (error) {
      console.warn(`❌ Failed to play sound ${name}:`, error)
      // 재생 실패 시 사운드 생성기로 대체
      await this.playGeneratedSound(name, volume)
    }
  }

  /**
   * 사운드 생성기를 사용한 사운드 재생
   */
  private async playGeneratedSound(
    name: string,
    volume?: number
  ): Promise<void> {
    try {
      // 사운드 생성기의 마스터 볼륨도 동기화
      soundGenerator.setMasterVolume(this.masterVolume)

      switch (name) {
        case 'walk_sound':
        case 'footstep':
          await soundGenerator.playFootstep(volume)
          break
        case 'jump_sound':
        case 'jump': {
          // 다양한 jump 사운드 중 랜덤 선택
          const jumpVariants = [
            () => soundGenerator.playJump(volume),
            () => soundGenerator.playJumpSimple(volume),
            () => soundGenerator.playJumpPulse(volume),
          ]
          const randomJump =
            jumpVariants[Math.floor(Math.random() * jumpVariants.length)]
          await randomJump()
          break
        }
        case 'jump_01':
        case 'jump_02':
        case 'jump_03':
          // MP3 파일이 로드되지 않았을 때 Web Audio API로 대체
          await soundGenerator.playJump(volume)
          break
        case 'jump_simple':
          await soundGenerator.playJumpSimple(volume)
          break
        case 'jump_pulse':
          await soundGenerator.playJumpPulse(volume)
          break
        case 'run_sound':
        case 'run':
          await soundGenerator.playRun(volume)
          break
        case 'button_sound':
        case 'button_click':
          await soundGenerator.playButtonClick(volume)
          break
        case 'land_sound':
        case 'land':
          await soundGenerator.playLand(volume)
          break
        case 'notification_sound':
        case 'notification':
          await soundGenerator.playNotification(volume)
          break
        default:
          console.log(`🎵 No generated sound available for: ${name}`)
      }
    } catch (error) {
      console.warn(`❌ Failed to play generated sound ${name}:`, error)
    }
  }

  /**
   * 사운드 정지
   */
  stopSound(name: string): void {
    const audio = this.sounds.get(name)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * 모든 사운드 정지
   */
  stopAllSounds(): void {
    for (const audio of this.sounds.values()) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * 사운드 활성화/비활성화
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (!enabled) {
      this.stopAllSounds()
    }
  }

  /**
   * 마스터 볼륨 설정
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))

    // 모든 사운드의 볼륨 업데이트
    for (const audio of this.sounds.values()) {
      audio.volume = audio.volume / (this.masterVolume / volume)
    }
  }

  /**
   * 사운드 볼륨 설정
   */
  setSoundVolume(name: string, volume: number): void {
    const audio = this.sounds.get(name)
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume)) * this.masterVolume
    }
  }

  /**
   * 사운드 제거
   */
  removeSound(name: string): void {
    const audio = this.sounds.get(name)
    if (audio) {
      audio.pause()
      audio.src = ''
      this.sounds.delete(name)
    }
  }

  /**
   * 모든 사운드 제거
   */
  clearAllSounds(): void {
    for (const audio of this.sounds.values()) {
      audio.pause()
      audio.src = ''
    }
    this.sounds.clear()
  }

  /**
   * 사운드 목록 가져오기
   */
  getSoundNames(): string[] {
    return Array.from(this.sounds.keys())
  }

  /**
   * 사운드 존재 여부 확인
   */
  hasSound(name: string): boolean {
    return this.sounds.has(name)
  }

  /**
   * 현재 상태 정보
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      masterVolume: this.masterVolume,
      soundCount: this.sounds.size,
      soundNames: this.getSoundNames(),
    }
  }
}

// 전역 사운드 매니저 인스턴스
export const soundManager = new SoundManager()
