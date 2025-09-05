import { useCallback, useEffect, useState } from 'react'
import { SpineBoy } from '../ts/spine'

interface SpineControlsProps {
  spineBoy: SpineBoy | null
  isSpineReady: boolean
}

export const SpineControlsInline = ({
  spineBoy,
  isSpineReady,
}: SpineControlsProps) => {
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right'>(
    'right'
  )
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState<
    'walk' | 'run' | 'idle'
  >('idle')

  // 방향 변경
  const changeDirection = useCallback(
    (direction: 'left' | 'right') => {
      if (spineBoy) {
        spineBoy.setDirection(direction)
        setCurrentDirection(direction)
      }
    },
    [spineBoy]
  )

  // 컨트롤 패널 토글
  const toggleVisibility = () => {
    setIsVisible(prev => !prev)
  }

  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSpineReady || !spineBoy) return
      // 키가 이미 눌려있는 경우 중복 처리 방지
      if (pressedKeys.has(event.key)) return
      // 눌린 키 상태 추가
      setPressedKeys(prev => new Set(prev).add(event.key))

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          changeDirection('left')
          // 움직임이 활성화되어 있으면 이전 애니메이션 재시작, 아니면 걷기 시작
          if (isMoving && currentAnimation !== 'idle') {
            spineBoy.playAnimation(currentAnimation, true)
          } else {
            spineBoy.playAnimation('walk', true)
            setIsMoving(true)
            setCurrentAnimation('walk')
          }
          break
        case 'ArrowRight':
          event.preventDefault()
          changeDirection('right')
          // 움직임이 활성화되어 있으면 이전 애니메이션 재시작, 아니면 걷기 시작
          if (isMoving && currentAnimation !== 'idle') {
            spineBoy.playAnimation(currentAnimation, true)
          } else {
            spineBoy.playAnimation('walk', true)
            setIsMoving(true)
            setCurrentAnimation('walk')
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          spineBoy.playAnimation('jump', false)
          break
        case 'ArrowDown':
          event.preventDefault()
          spineBoy.stopAnimation()
          break
        case ' ':
          // 스페이스바로 점프
          event.preventDefault()
          spineBoy.playAnimation('jump', false)
          break
        case 'a':
        case 'A':
          // A키로 왼쪽
          event.preventDefault()
          changeDirection('left')
          // 움직임이 활성화되어 있으면 이전 애니메이션 재시작, 아니면 걷기 시작
          if (isMoving && currentAnimation !== 'idle') {
            spineBoy.playAnimation(currentAnimation, true)
          } else {
            spineBoy.playAnimation('walk', true)
            setIsMoving(true)
            setCurrentAnimation('walk')
          }
          break
        case 'd':
        case 'D':
          // D키로 오른쪽
          event.preventDefault()
          changeDirection('right')
          // 움직임이 활성화되어 있으면 이전 애니메이션 재시작, 아니면 걷기 시작
          if (isMoving && currentAnimation !== 'idle') {
            spineBoy.playAnimation(currentAnimation, true)
          } else {
            spineBoy.playAnimation('walk', true)
            setIsMoving(true)
            setCurrentAnimation('walk')
          }
          break
        case 'w':
        case 'W':
          // W키로 점프
          event.preventDefault()
          spineBoy.playAnimation('jump', false)
          break
        case 's':
        case 'S':
          // S키로 멈춤
          event.preventDefault()
          spineBoy.stopAnimation()
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      // 눌린 키 상태 제거
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(event.key)
        return newSet
      })
    }

    // 키보드 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    isSpineReady,
    spineBoy,
    changeDirection,
    pressedKeys,
    isMoving,
    currentAnimation,
  ])

  if (!isSpineReady || !spineBoy) {
    return null
  }

  return (
    <>
      {/* 토글 버튼 (눈 모양) */}
      <button
        onClick={toggleVisibility}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '50px',
          height: '50px',
          border: '2px solid #333',
          borderRadius: '50%',
          background: '#4CAF50',
          color: 'white',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          zIndex: 1001,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isVisible ? '−' : '+'}
      </button>

      {/* 컨트롤 패널 */}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '70px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            zIndex: 1000,
            minWidth: '200px',
          }}
        >
          {/* 키보드 방향키 컨트롤 */}
          <div>
            <div
              style={{
                marginBottom: '8px',
                fontSize: '12px',
                color: '#ccc',
                textAlign: 'center',
              }}
            >
              방향키 컨트롤:
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              {/* 왼쪽 방향키 */}
              <button
                onClick={() => changeDirection('left')}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background:
                    pressedKeys.has('ArrowLeft') ||
                    pressedKeys.has('a') ||
                    pressedKeys.has('A')
                      ? '#E64A19'
                      : currentDirection === 'left'
                        ? '#FF5722'
                        : '#757575',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    pressedKeys.has('ArrowLeft') ||
                    pressedKeys.has('a') ||
                    pressedKeys.has('A')
                      ? 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      : '0 2px 4px rgba(0,0,0,0.3)',
                  transform:
                    pressedKeys.has('ArrowLeft') ||
                    pressedKeys.has('a') ||
                    pressedKeys.has('A')
                      ? 'scale(0.95)'
                      : 'scale(1)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (
                    currentDirection !== 'left' &&
                    !pressedKeys.has('ArrowLeft') &&
                    !pressedKeys.has('a') &&
                    !pressedKeys.has('A')
                  ) {
                    e.currentTarget.style.background = '#616161'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (
                    currentDirection !== 'left' &&
                    !pressedKeys.has('ArrowLeft') &&
                    !pressedKeys.has('a') &&
                    !pressedKeys.has('A')
                  ) {
                    e.currentTarget.style.background = '#757575'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                ←
              </button>

              {/* 위쪽 방향키 (점프) */}
              <button
                onClick={() => spineBoy.playAnimation('jump', false)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background:
                    pressedKeys.has('ArrowUp') ||
                    pressedKeys.has('w') ||
                    pressedKeys.has('W') ||
                    pressedKeys.has(' ')
                      ? '#F57C00'
                      : '#FF9800',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    pressedKeys.has('ArrowUp') ||
                    pressedKeys.has('w') ||
                    pressedKeys.has('W') ||
                    pressedKeys.has(' ')
                      ? 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      : '0 2px 4px rgba(0,0,0,0.3)',
                  transform:
                    pressedKeys.has('ArrowUp') ||
                    pressedKeys.has('w') ||
                    pressedKeys.has('W') ||
                    pressedKeys.has(' ')
                      ? 'scale(0.95)'
                      : 'scale(1)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (
                    !pressedKeys.has('ArrowUp') &&
                    !pressedKeys.has('w') &&
                    !pressedKeys.has('W') &&
                    !pressedKeys.has(' ')
                  ) {
                    e.currentTarget.style.background = '#F57C00'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (
                    !pressedKeys.has('ArrowUp') &&
                    !pressedKeys.has('w') &&
                    !pressedKeys.has('W') &&
                    !pressedKeys.has(' ')
                  ) {
                    e.currentTarget.style.background = '#FF9800'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                ↑
              </button>

              {/* 오른쪽 방향키 */}
              <button
                onClick={() => changeDirection('right')}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background:
                    pressedKeys.has('ArrowRight') ||
                    pressedKeys.has('d') ||
                    pressedKeys.has('D')
                      ? '#E64A19'
                      : currentDirection === 'right'
                        ? '#FF5722'
                        : '#757575',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    pressedKeys.has('ArrowRight') ||
                    pressedKeys.has('d') ||
                    pressedKeys.has('D')
                      ? 'inset 0 2px 4px rgba(0,0,0,0.3)'
                      : '0 2px 4px rgba(0,0,0,0.3)',
                  transform:
                    pressedKeys.has('ArrowRight') ||
                    pressedKeys.has('d') ||
                    pressedKeys.has('D')
                      ? 'scale(0.95)'
                      : 'scale(1)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (
                    currentDirection !== 'right' &&
                    !pressedKeys.has('ArrowRight') &&
                    !pressedKeys.has('d') &&
                    !pressedKeys.has('D')
                  ) {
                    e.currentTarget.style.background = '#616161'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (
                    currentDirection !== 'right' &&
                    !pressedKeys.has('ArrowRight') &&
                    !pressedKeys.has('d') &&
                    !pressedKeys.has('D')
                  ) {
                    e.currentTarget.style.background = '#757575'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                →
              </button>
            </div>

            {/* 방향키 설명 */}
            <div
              style={{
                fontSize: '10px',
                color: '#999',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              ← 방향전환 | ↑ 점프 | → 방향전환
            </div>

            {/* 키보드 단축키 안내 */}
          </div>
          {/* 애니메이션 컨트롤 */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              {/* 걷기 버튼 */}
              <button
                onClick={() => {
                  spineBoy.playAnimation('walk', true)
                  setIsMoving(true)
                  setCurrentAnimation('walk')
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#45a049'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#4CAF50'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                걷기
              </button>

              {/* 뛰기 버튼 */}
              <button
                onClick={() => {
                  spineBoy.playAnimation('run', true)
                  setIsMoving(true)
                  setCurrentAnimation('run')
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background: '#2196F3',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1976D2'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#2196F3'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                뛰기
              </button>

              {/* 정지 버튼 */}
              <button
                onClick={() => {
                  spineBoy.stopAnimation()
                  setIsMoving(false)
                  setCurrentAnimation('idle')
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  background: '#f44336',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#d32f2f'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f44336'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                정지
              </button>
            </div>

            {/* 애니메이션 설명 */}
            <div
              style={{
                fontSize: '10px',
                color: '#999',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              걷기 | 뛰기 | 정지
            </div>
          </div>
        </div>
      )}
    </>
  )
}
