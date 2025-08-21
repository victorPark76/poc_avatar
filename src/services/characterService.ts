import type { Character } from '@/features/poc_a/components/CharacterManager/index'
import type { CharacterWithRank } from '@/utils/ranking'

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

/**
 * 캐릭터 목록을 가져오는 API 함수
 * 실제 프로젝트에서는 fetch나 axios를 사용하여 실제 API 호출
 */
export const fetchCharacters = async (): Promise<
  ApiResponse<CharacterWithRank[]>
> => {
  try {
    // 실제 API 호출 (예: fetch('/api/characters'))
    const response = await fetch('/api/characters')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.characters || [],
      success: true,
      message: '캐릭터 목록을 성공적으로 가져왔습니다.',
    }
  } catch (error) {
    return {
      data: [],
      success: false,
      message:
        error instanceof Error
          ? error.message
          : '캐릭터 목록을 가져오는데 실패했습니다.',
    }
  }
}

/**
 * 새로운 캐릭터를 추가하는 API 함수
 */
export const createCharacter = async (
  character: Character
): Promise<ApiResponse<CharacterWithRank>> => {
  try {
    const response = await fetch('/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.character,
      success: true,
      message: '캐릭터가 성공적으로 추가되었습니다.',
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '캐릭터 추가에 실패했습니다.'
    )
  }
}

/**
 * 캐릭터를 업데이트하는 API 함수
 */
export const updateCharacter = async (
  id: string,
  character: Partial<Character>
): Promise<ApiResponse<CharacterWithRank>> => {
  try {
    const response = await fetch(`/api/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.character,
      success: true,
      message: '캐릭터가 성공적으로 업데이트되었습니다.',
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '캐릭터 업데이트에 실패했습니다.'
    )
  }
}

/**
 * 캐릭터를 삭제하는 API 함수
 */
export const deleteCharacter = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await fetch(`/api/characters/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      data: true,
      success: true,
      message: '캐릭터가 성공적으로 삭제되었습니다.',
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : '캐릭터 삭제에 실패했습니다.'
    )
  }
}
