import type { Character } from '@/features/poc_a/components/CharacterManager/index'

// Character 인터페이스에 rank 속성 추가
export interface CharacterWithRank extends Character {
  rank: number
}

/**
 * 캐릭터들의 점수를 기준으로 순위를 계산하는 함수
 * @param characters 순위를 계산할 캐릭터 배열
 * @returns 순위가 추가된 캐릭터 배열
 */
export const calculateRankedCharacters = (
  characters: Character[]
): CharacterWithRank[] => {
  // score를 기준으로 내림차순 정렬하여 순위 계산
  const sortedByScore = [...characters].sort((a, b) => b.score - a.score)

  // 공동 순위를 계산하기 위한 맵 생성
  const scoreToRankMap = new Map<number, number>()
  let currentRank = 1

  // 정렬된 배열을 순회하며 공동 순위 계산
  for (let i = 0; i < sortedByScore.length; i++) {
    const char = sortedByScore[i]
    if (i === 0 || char.score !== sortedByScore[i - 1].score) {
      currentRank = i + 1
    }
    scoreToRankMap.set(char.score, currentRank)
  }

  // 원래 배열 순서를 유지하면서 rank 추가
  return characters.map(character => {
    const rank = scoreToRankMap.get(character.score) || 1
    return { ...character, rank }
  })
}

/**
 * 특정 점수에 대한 순위를 계산하는 함수
 * @param score 계산할 점수
 * @param characters 전체 캐릭터 배열
 * @returns 해당 점수의 순위 (1부터 시작)
 */
export const calculateRankForScore = (
  score: number,
  characters: Character[]
): number => {
  const sortedByScore = [...characters].sort((a, b) => b.score - a.score)
  return sortedByScore.findIndex(char => char.score === score) + 1
}

/**
 * 순위별로 캐릭터를 그룹화하는 함수
 * @param characters 순위가 포함된 캐릭터 배열
 * @returns 순위별로 그룹화된 캐릭터 객체
 */
export const groupCharactersByRank = (
  characters: CharacterWithRank[]
): Record<number, CharacterWithRank[]> => {
  return characters.reduce(
    (groups, character) => {
      const rank = character.rank
      if (!groups[rank]) {
        groups[rank] = []
      }
      groups[rank].push(character)
      return groups
    },
    {} as Record<number, CharacterWithRank[]>
  )
}
