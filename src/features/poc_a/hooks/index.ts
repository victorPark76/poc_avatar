import { useCharacterStore } from '@/stores/characterStore'
import { useScreenSizeStore } from '@/stores/screenSizeStore'
import { calculateRankedCharacters } from '@/utils/ranking'
import { useCallback, useEffect, useState } from 'react'
import { mockCharacters } from '../mock/api'

// 화면 리사이즈 처리 훅
export const useScreenResize = () => {
  const { setWidth } = useScreenSizeStore()

  const debouncedResize = useCallback(() => {
    let timeoutId: number
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth
        setWidth(newWidth)
        console.log('Test - 화면 리사이즈됨:', {
          width: newWidth,
          height: Math.round(newWidth * (9 / 16)),
        })
      }, 150) // 150ms 지연
    }
  }, [setWidth])

  useEffect(() => {
    const handleResize = debouncedResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [debouncedResize])
}

// 구름 설정 계산 훅
export const useCloudConfiguration = (height: number) => {
  const clouds = [
    {
      src: '/images/cloud.png',
      travel: 300,
      speed: 1.2,
      y: Math.round(height * 0.17),
      startOffsetX: -200,
      scale: 1.0,
    },
    {
      src: '/images/cloud.png',
      travel: 400,
      speed: 0.8,
      y: Math.round(height * 0.06),
      startOffsetX: -300,
      scale: 0.8,
    },
    {
      src: '/images/cloud.png',
      travel: 250,
      speed: 1.5,
      y: Math.round(height * 0.33),
      startOffsetX: -150,
      scale: 1.2,
    },
  ]

  return clouds
}

// 캐릭터 데이터 로딩 훅
export const useCharacterData = () => {
  const { setCharacters, setLoading } = useCharacterStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Mock 데이터를 사용하여 순위 계산
    setTimeout(() => {
      try {
        const rankedCharacters = calculateRankedCharacters(mockCharacters)
        setCharacters(rankedCharacters)
        setLoading(false)
      } catch (err) {
        setError('캐릭터 데이터를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
        console.error('캐릭터 데이터 로딩 오류:', err)
      }
    }, 500) // API 호출 시뮬레이션
  }, [setCharacters, setLoading])

  return { error, setError }
}

// 캐릭터 관리 훅
export const useCharacterManagement = () => {
  const { characters, selectedCharacterIndex, updateCharacter } =
    useCharacterStore()
  const characterData = characters[selectedCharacterIndex]

  const handleCharacterChange = useCallback(
    (newData: typeof characterData) => {
      if (characterData) {
        updateCharacter(selectedCharacterIndex, newData)

        // 점수 변경 시 순위 재계산 (즉시 처리)
        const { characters } = useCharacterStore.getState()
        const rankedCharacters = calculateRankedCharacters(characters)
        useCharacterStore.getState().setCharacters(rankedCharacters)
      }
    },
    [selectedCharacterIndex, updateCharacter, characterData]
  )

  return { characterData, handleCharacterChange }
}
