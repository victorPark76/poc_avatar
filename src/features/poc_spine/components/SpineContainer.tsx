import { Assets, Container } from 'pixi.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { calculateScale } from '../../../utils/aspectRatio'
import { type SoundConfig } from '../ts/soundManager'
import { SpineBoy } from '../ts/spine'

interface SpineContainerProps {
  onSpineReady?: (spineBoy: SpineBoy | null, isReady: boolean) => void
  initialAnimation?: string
  size?: number
}

export const SpineContainer = ({ onSpineReady }: SpineContainerProps) => {
  const [spineBoy, setSpineBoy] = useState<SpineBoy | null>(null)
  const [isSpineReady, setIsSpineReady] = useState(false)
  const containerRef = useRef<Container>(null)

  // Spine 객체의 위치와 크기를 조정하는 함수
  const updateSpineLayout = useCallback(() => {
    if (spineBoy && containerRef.current) {
      const spineView = spineBoy.getView()
      if (spineView) {
        // 화면 크기 가져오기
        const width = window.innerWidth
        const height = (width * 9) / 16 // 16:9 비율

        // Spine 객체를 화면 중앙 하단에 위치
        spineView.x = width / 2
        spineView.y = height * 0.9

        // 유틸리티 함수를 사용하여 스케일 계산
        const scale = calculateScale(width, height)
        spineView.scale.set(scale)

        console.log('Spine updated:', {
          x: spineView.x,
          y: spineView.y,
          scale,
        })
      }
    }
  }, [spineBoy])

  // Spine 객체를 컨테이너에 추가하는 함수
  const addSpineToContainer = useCallback(
    (container: Container) => {
      if (spineBoy && container) {
        const spineView = spineBoy.getView()
        if (spineView) {
          container.addChild(spineView)
          // 컨테이너에 추가된 후 레이아웃 업데이트
          setTimeout(() => updateSpineLayout(), 0)
        }
      }
    },
    [spineBoy, updateSpineLayout]
  )

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      updateSpineLayout()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateSpineLayout])

  // Spine 초기화
  useEffect(() => {
    const init = async () => {
      try {
        // 에셋 로드 (에러 처리 개선)
        try {
          await Assets.load([
            {
              alias: 'spineSkeleton',
              src: '/images/spineboy-pro.skel',
            },
            {
              alias: 'spineAtlas',
              src: '/images/spineboy-pma.atlas',
            },
          ])
          console.log('Spine 에셋 로드 완료')
        } catch (assetError) {
          console.error('Spine 에셋 로드 실패:', assetError)
          throw assetError
        }

        // SpineBoy 인스턴스 생성
        const newSpineBoy = new SpineBoy()
        setSpineBoy(newSpineBoy)
        setIsSpineReady(true)

        // 사운드 설정 로드
        const soundConfigs: SoundConfig[] = [
          {
            name: 'walk_sound',
            src: '/sounds/walk.mp3',
            volume: 0.5,
            preload: true,
          },
          {
            name: 'jump_sound',
            src: '/sounds/jump_01.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'jump_01',
            src: '/sounds/jump_01.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'jump_02',
            src: '/sounds/jump_02.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'jump_03',
            src: '/sounds/jump_03.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'jump_simple',
            src: '/sounds/jump_simple.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'jump_pulse',
            src: '/sounds/jump_pulse.mp3',
            volume: 0.7,
            preload: true,
          },
          {
            name: 'run_sound',
            src: '/sounds/run.mp3',
            volume: 0.6,
            preload: true,
          },
          {
            name: 'button_sound',
            src: '/sounds/button_click.mp3',
            volume: 0.3,
            preload: true,
          },
        ]

        // 사운드 로드 (에러가 있어도 계속 진행)
        try {
          await newSpineBoy.loadSoundConfigs(soundConfigs)

          // 사운드 이벤트 매핑 설정
          newSpineBoy.addSoundEvent('footstep', 'walk_sound')
          newSpineBoy.addSoundEvent('jump', 'jump_pulse')
          newSpineBoy.addSoundEvent('run', 'run_sound')
          newSpineBoy.addSoundEvent('button_click', 'button_sound')

          // 추가 점프 사운드 이벤트 매핑
          newSpineBoy.addSoundEvent('jump_01', 'jump_01')
          newSpineBoy.addSoundEvent('jump_02', 'jump_02')
          newSpineBoy.addSoundEvent('jump_03', 'jump_03')

          console.log('사운드 설정 완료')
        } catch (soundError) {
          console.warn('사운드 로드 실패 (계속 진행):', soundError)
        }

        // 부모 컴포넌트에 상태 전달
        onSpineReady?.(newSpineBoy, true)

        // 기본 애니메이션 재생 (예: walk)
        if (newSpineBoy) {
          newSpineBoy.playAnimation('walk', true)
        }
      } catch (error) {
        console.error('Failed to initialize Spine:', error)
        onSpineReady?.(null, false)
      }
    }

    init()

    // 클린업 함수
    return () => {
      if (spineBoy) {
        // Spine 객체 정리
        try {
          const spineView = spineBoy.getView()
          if (spineView && spineView.parent) {
            spineView.parent.removeChild(spineView)
          }
        } catch (error) {
          console.error('Error cleaning up Spine:', error)
        }
      }
      onSpineReady?.(null, false)
    }
  }, []) // 빈 의존성 배열로 변경하여 한 번만 실행되도록 함

  return (
    <>
      {/* Spine 렌더링 */}
      {isSpineReady && (
        <pixiContainer
          ref={ref => {
            if (ref) {
              containerRef.current = ref
              addSpineToContainer(ref)
            }
          }}
        />
      )}
    </>
  )
}
