/**
 * Web Audio API를 사용한 간단한 효과음 생성기
 * 실제 사운드 파일이 없을 때 대체용으로 사용
 */

export class SoundGenerator {
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private masterVolume: number = 0.7

  constructor() {
    this.initializeAudioContext()
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
      this.isInitialized = true
      console.log('🎵 SoundGenerator initialized')
    } catch (error) {
      console.warn('Failed to initialize SoundGenerator:', error)
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initializeAudioContext()
    }
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  /**
   * 간단한 톤 생성
   */
  private createTone(
    frequency: number,
    duration: number,
    volume: number = 0.1
  ): void {
    if (!this.audioContext || !this.isInitialized) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    )
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * 발걸음 소리 생성
   */
  async playFootstep(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.05) * this.masterVolume
    this.createTone(200, 0.1, effectiveVolume)
    console.log(`👣 Generated footstep sound (volume: ${effectiveVolume})`)
  }

  /**
   * 점프 소리 생성 (다양한 버전)
   */
  async playJump(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.15) * this.masterVolume

    // 더 복잡한 점프 사운드: 상승 + 하강
    const oscillator1 = this.audioContext!.createOscillator()
    const oscillator2 = this.audioContext!.createOscillator()
    const gainNode = this.audioContext!.createGain()

    oscillator1.connect(gainNode)
    oscillator2.connect(gainNode)
    gainNode.connect(this.audioContext!.destination)

    // 첫 번째 톤: 상승하는 톤
    oscillator1.type = 'sine'
    oscillator1.frequency.setValueAtTime(200, this.audioContext!.currentTime)
    oscillator1.frequency.linearRampToValueAtTime(
      500,
      this.audioContext!.currentTime + 0.15
    )

    // 두 번째 톤: 하강하는 톤 (약간의 딜레이)
    oscillator2.type = 'triangle'
    oscillator2.frequency.setValueAtTime(
      400,
      this.audioContext!.currentTime + 0.1
    )
    oscillator2.frequency.linearRampToValueAtTime(
      150,
      this.audioContext!.currentTime + 0.25
    )

    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      effectiveVolume,
      this.audioContext!.currentTime + 0.02
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext!.currentTime + 0.3
    )

    oscillator1.start(this.audioContext!.currentTime)
    oscillator1.stop(this.audioContext!.currentTime + 0.3)
    oscillator2.start(this.audioContext!.currentTime + 0.1)
    oscillator2.stop(this.audioContext!.currentTime + 0.3)

    console.log(`🦘 Generated enhanced jump sound (volume: ${effectiveVolume})`)
  }

  /**
   * 대체 점프 소리 생성 (더 간단한 버전)
   */
  async playJumpSimple(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.12) * this.masterVolume

    // 간단한 상승 톤
    const oscillator = this.audioContext!.createOscillator()
    const gainNode = this.audioContext!.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext!.destination)

    oscillator.type = 'square' // 더 날카로운 소리
    oscillator.frequency.setValueAtTime(150, this.audioContext!.currentTime)
    oscillator.frequency.linearRampToValueAtTime(
      400,
      this.audioContext!.currentTime + 0.25
    )

    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      effectiveVolume,
      this.audioContext!.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext!.currentTime + 0.25
    )

    oscillator.start(this.audioContext!.currentTime)
    oscillator.stop(this.audioContext!.currentTime + 0.25)
    console.log(`🦘 Generated simple jump sound (volume: ${effectiveVolume})`)
  }

  /**
   * 점프 사운드 (펄스 버전)
   */
  async playJumpPulse(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.1) * this.masterVolume

    // 펄스 형태의 점프 사운드
    for (let i = 0; i < 3; i++) {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(
        300 + i * 50,
        this.audioContext!.currentTime + i * 0.05
      )

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + i * 0.05)
      gainNode.gain.linearRampToValueAtTime(
        effectiveVolume * (1 - i * 0.3),
        this.audioContext!.currentTime + i * 0.05 + 0.01
      )
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext!.currentTime + i * 0.05 + 0.1
      )

      oscillator.start(this.audioContext!.currentTime + i * 0.05)
      oscillator.stop(this.audioContext!.currentTime + i * 0.05 + 0.1)
    }
    console.log(`🦘 Generated pulse jump sound (volume: ${effectiveVolume})`)
  }

  /**
   * 달리기 소리 생성
   */
  async playRun(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.04) * this.masterVolume
    // 빠른 발걸음 소리
    this.createTone(250, 0.05, effectiveVolume)
    setTimeout(() => this.createTone(200, 0.05, effectiveVolume), 50)
    console.log(`🏃 Generated run sound (volume: ${effectiveVolume})`)
  }

  /**
   * 버튼 클릭 소리 생성
   */
  async playButtonClick(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.08) * this.masterVolume
    // 높은 주파수의 짧은 클릭 소리
    this.createTone(800, 0.1, effectiveVolume)
    console.log(`🔘 Generated button click sound (volume: ${effectiveVolume})`)
  }

  /**
   * 착지 소리 생성
   */
  async playLand(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.06) * this.masterVolume
    // 낮은 주파수의 짧은 충격음
    this.createTone(150, 0.15, effectiveVolume)
    console.log(`🦶 Generated land sound (volume: ${effectiveVolume})`)
  }

  /**
   * 알림 소리 생성
   */
  async playNotification(volume?: number): Promise<void> {
    await this.ensureAudioContext()
    const effectiveVolume = (volume || 0.1) * this.masterVolume

    // 상승하는 알림 톤
    const oscillator = this.audioContext!.createOscillator()
    const gainNode = this.audioContext!.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext!.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(400, this.audioContext!.currentTime)
    oscillator.frequency.linearRampToValueAtTime(
      800,
      this.audioContext!.currentTime + 0.3
    )

    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime)
    gainNode.gain.linearRampToValueAtTime(
      effectiveVolume,
      this.audioContext!.currentTime + 0.01
    )
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext!.currentTime + 0.3
    )

    oscillator.start(this.audioContext!.currentTime)
    oscillator.stop(this.audioContext!.currentTime + 0.3)
    console.log(`🔔 Generated notification sound (volume: ${effectiveVolume})`)
  }

  /**
   * 마스터 볼륨 설정
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    console.log(`🎵 SoundGenerator master volume set to: ${this.masterVolume}`)
  }

  /**
   * 사용자 상호작용으로 오디오 컨텍스트 활성화
   */
  async activateAudioContext(): Promise<void> {
    await this.ensureAudioContext()
    console.log('🎵 Audio context activated')
  }
}

// 전역 사운드 생성기 인스턴스
export const soundGenerator = new SoundGenerator()
