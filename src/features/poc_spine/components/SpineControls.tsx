import { useEffect, useState } from 'react'
import { soundManager } from '../ts/soundManager'
import { SpineBoy } from '../ts/spine'

interface SpineControlsProps {
  spineBoy: SpineBoy | null
  isSpineReady: boolean
}

export const SpineControls = ({
  spineBoy,
  isSpineReady,
}: SpineControlsProps) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [soundNames, setSoundNames] = useState<string[]>([])
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right'>(
    'right'
  )

  // 사운드 상태 업데이트
  useEffect(() => {
    const updateSoundStatus = () => {
      const status = soundManager.getStatus()
      setIsSoundEnabled(status.isEnabled)
      setMasterVolume(status.masterVolume)
      setSoundNames(status.soundNames)
    }

    updateSoundStatus()

    // 주기적으로 상태 업데이트
    const interval = setInterval(updateSoundStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!isSpineReady || !spineBoy) {
    return null
  }

  // 사운드 토글
  const toggleSound = () => {
    const newEnabled = !isSoundEnabled
    setIsSoundEnabled(newEnabled)
    spineBoy.setSoundEnabled(newEnabled)
  }

  // 볼륨 변경
  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume)
    spineBoy.setMasterVolume(volume)
  }

  // 사운드 재생 테스트
  const playTestSound = (soundName: string) => {
    spineBoy.playSound(soundName)
  }

  // 방향 변경
  const changeDirection = (direction: 'left' | 'right') => {
    spineBoy.setDirection(direction)
    setCurrentDirection(direction)
  }

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 1000,
        minWidth: '200px',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        Spine Controls:
      </div>

      {/* 방향 컨트롤 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#ccc' }}>
          방향:
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          <button
            onClick={() => changeDirection('left')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: currentDirection === 'left' ? '#FF5722' : '#757575',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: currentDirection === 'left' ? 'bold' : 'normal',
            }}
            onMouseEnter={e => {
              if (currentDirection !== 'left') {
                e.currentTarget.style.background = '#616161'
              }
            }}
            onMouseLeave={e => {
              if (currentDirection !== 'left') {
                e.currentTarget.style.background = '#757575'
              }
            }}
          >
            ← 왼쪽
          </button>
          <button
            onClick={() => changeDirection('right')}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: currentDirection === 'right' ? '#FF5722' : '#757575',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: currentDirection === 'right' ? 'bold' : 'normal',
            }}
            onMouseEnter={e => {
              if (currentDirection !== 'right') {
                e.currentTarget.style.background = '#616161'
              }
            }}
            onMouseLeave={e => {
              if (currentDirection !== 'right') {
                e.currentTarget.style.background = '#757575'
              }
            }}
          >
            오른쪽 →
          </button>
        </div>
      </div>

      {/* 애니메이션 컨트롤 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#ccc' }}>
          애니메이션:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => spineBoy.playAnimation('walk', true)}
            style={{
              margin: '2px',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#45a049'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#4CAF50'
            }}
          >
            걷기
          </button>
          <button
            onClick={() => spineBoy.playAnimation('run', true)}
            style={{
              margin: '2px',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1976D2'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#2196F3'
            }}
          >
            뛰기
          </button>
          <button
            onClick={() => spineBoy.playAnimation('jump', false)}
            style={{
              margin: '2px',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#FF9800',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F57C00'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#FF9800'
            }}
          >
            점프
          </button>
          <button
            onClick={() => spineBoy.stopAnimation()}
            style={{
              margin: '2px',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              background: '#f44336',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d32f2f'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#f44336'
            }}
          >
            멈춤
          </button>
        </div>
      </div>

      {/* 사운드 컨트롤 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '4px', fontSize: '12px', color: '#ccc' }}>
          사운드:
        </div>

        {/* 사운드 토글 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <button
            onClick={toggleSound}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              background: isSoundEnabled ? '#4CAF50' : '#f44336',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            {isSoundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
          <span style={{ fontSize: '11px' }}>
            {isSoundEnabled ? '사운드 활성화' : '사운드 비활성화'}
          </span>
        </div>

        {/* 볼륨 슬라이더 */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px' }}>
            볼륨: {Math.round(masterVolume * 100)}%
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={masterVolume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              background: '#ddd',
              outline: 'none',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Jump 사운드 테스트 버튼들 */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}>
            Jump 사운드 테스트:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <button
              onClick={() => playTestSound('jump_sound')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#FF9800',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump (랜덤)
            </button>
            <button
              onClick={() => playTestSound('jump_simple')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#FF5722',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump Simple
            </button>
            <button
              onClick={() => playTestSound('jump_pulse')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#E91E63',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump Pulse
            </button>
            <button
              onClick={() => playTestSound('jump_01')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#FF6B35',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump 01
            </button>
            <button
              onClick={() => playTestSound('jump_02')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#F7931E',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump 02
            </button>
            <button
              onClick={() => playTestSound('jump_03')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#FFD23F',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Jump 03
            </button>
          </div>
        </div>

        {/* 기타 사운드 테스트 버튼들 */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}>
            기타 사운드:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <button
              onClick={() => playTestSound('walk_sound')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#4CAF50',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Walk
            </button>
            <button
              onClick={() => playTestSound('run_sound')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#2196F3',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Run
            </button>
            <button
              onClick={() => playTestSound('button_click')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#9C27B0',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Click
            </button>
            <button
              onClick={() => playTestSound('land_sound')}
              style={{
                padding: '2px 6px',
                border: 'none',
                borderRadius: '3px',
                background: '#607D8B',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Land
            </button>
          </div>
        </div>

        {/* 로드된 사운드 파일 테스트 버튼들 */}
        {soundNames.length > 0 && (
          <div>
            <div
              style={{ fontSize: '11px', marginBottom: '4px', color: '#ccc' }}
            >
              로드된 사운드 파일:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {soundNames.map(soundName => (
                <button
                  key={soundName}
                  onClick={() => playTestSound(soundName)}
                  style={{
                    padding: '2px 6px',
                    border: 'none',
                    borderRadius: '3px',
                    background: '#795548',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  {soundName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
