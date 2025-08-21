import { useState } from 'react'
import { type SoundConfig } from '../ts/soundManager'
import { SpineBoy } from '../ts/spine'

interface SoundExampleProps {
  spineBoy: SpineBoy | null
  isSpineReady: boolean
}

/**
 * Spine 애니메이션 사운드 기능 사용 예시 컴포넌트
 */
export const SoundExample = ({ spineBoy, isSpineReady }: SoundExampleProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [soundStatus, setSoundStatus] = useState<string>('')

  // 사운드 설정 예시
  const exampleSoundConfigs: SoundConfig[] = [
    {
      name: 'example_walk',
      src: '/sounds/walk.mp3',
      volume: 0.5,
      preload: true,
    },
    {
      name: 'example_jump',
      src: '/sounds/jump.mp3',
      volume: 0.7,
      preload: true,
    },
    {
      name: 'example_button',
      src: '/sounds/button_click.mp3',
      volume: 0.3,
      preload: true,
    },
  ]

  // 사운드 로드 예시
  const loadExampleSounds = async () => {
    if (!spineBoy) return

    setIsLoading(true)
    setSoundStatus('사운드 로딩 중...')

    try {
      // 사운드 설정 로드
      await spineBoy.loadSoundConfigs(exampleSoundConfigs)

      // 사운드 이벤트 매핑
      spineBoy.addSoundEvent('footstep', 'example_walk')
      spineBoy.addSoundEvent('jump', 'example_jump')

      setSoundStatus('사운드 로드 완료!')
      console.log('예시 사운드 로드 완료')
    } catch (error) {
      setSoundStatus('사운드 파일이 없습니다. public/sounds/ 폴더에 MP3 파일을 추가하세요.')
      console.error('사운드 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 사운드 테스트
  const testSound = async (soundName: string) => {
    if (!spineBoy) return

    try {
      await spineBoy.playSound(soundName)
      setSoundStatus(`${soundName} 재생 중...`)
    } catch (error) {
      setSoundStatus(`${soundName} 재생 실패`)
      console.error('사운드 재생 실패:', error)
    }
  }

  // 애니메이션과 함께 사운드 재생
  const playAnimationWithSound = (
    animationName: string,
    soundName?: string
  ) => {
    if (!spineBoy) return

    // 애니메이션 재생
    spineBoy.playAnimation(animationName, false)

    // 사운드 재생 (있는 경우)
    if (soundName) {
      spineBoy.playSound(soundName)
    }
  }

  if (!isSpineReady || !spineBoy) {
    return (
      <div
        style={{
          padding: '10px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          borderRadius: '5px',
          margin: '10px 0',
        }}
      >
        Spine가 준비되지 않았습니다.
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '15px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        borderRadius: '8px',
        margin: '10px 0',
        border: '1px solid #333',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        🔊 Spine 사운드 예시
      </h3>

      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#ccc' }}>
        상태: {soundStatus}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* 사운드 로드 버튼 */}
        <button
          onClick={loadExampleSounds}
          disabled={isLoading}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            background: isLoading ? '#666' : '#4CAF50',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          {isLoading ? '로딩 중...' : '예시 사운드 로드'}
        </button>

        {/* 사운드 테스트 버튼들 */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => testSound('example_walk')}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            걷기 소리
          </button>
          <button
            onClick={() => testSound('example_jump')}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#FF9800',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            점프 소리
          </button>
          <button
            onClick={() => testSound('example_button')}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#9C27B0',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            버튼 소리
          </button>
        </div>

        {/* 애니메이션 + 사운드 조합 */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => playAnimationWithSound('walk', 'example_walk')}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            걷기 + 소리
          </button>
          <button
            onClick={() => playAnimationWithSound('jump', 'example_jump')}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#FF9800',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            점프 + 소리
          </button>
        </div>

        {/* 사운드 제어 */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => spineBoy.setSoundEnabled(true)}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            🔊 ON
          </button>
          <button
            onClick={() => spineBoy.setSoundEnabled(false)}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#f44336',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            🔇 OFF
          </button>
          <button
            onClick={() => spineBoy.stopAllSounds()}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '3px',
              background: '#666',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            정지
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#ccc',
        }}
      >
        <strong>사용법:</strong>
        <br />
        1. "예시 사운드 로드" 버튼을 클릭하여 사운드를 로드합니다
        <br />
        2. 개별 사운드 버튼으로 테스트할 수 있습니다
        <br />
        3. 애니메이션과 사운드를 함께 재생할 수 있습니다
        <br />
        4. 사운드 ON/OFF 및 정지 기능을 사용할 수 있습니다
      </div>
    </div>
  )
}
