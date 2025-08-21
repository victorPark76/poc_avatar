import type { Character } from '@/features/poc_a/components/CharacterManager/index'
import type { CharacterWithRank } from '@/utils/ranking'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CharacterStore {
  characters: CharacterWithRank[]
  selectedCharacterIndex: number
  isLoading: boolean
  error: string | null

  // 상태 설정
  setCharacters: (characters: CharacterWithRank[]) => void
  setSelectedCharacterIndex: (index: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // 캐릭터 조작
  addCharacter: (character: Character) => void
  updateCharacter: (index: number, character: Character) => void
  deleteCharacter: (index: number) => void

  // 초기화
  reset: () => void
}

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    (set, get) => ({
      characters: [],
      selectedCharacterIndex: 0,
      isLoading: false,
      error: null,

      setCharacters: (characters: CharacterWithRank[]) => set({ characters }),

      setSelectedCharacterIndex: index =>
        set({ selectedCharacterIndex: index }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      addCharacter: character => {
        const { characters } = get()
        const newCharacters = [...characters, character as CharacterWithRank]
        set({
          characters: newCharacters,
          selectedCharacterIndex: newCharacters.length - 1,
        })
      },

      updateCharacter: (index, character) => {
        const { characters } = get()
        const newCharacters = [...characters]
        const existingCharacter = newCharacters[index]
        newCharacters[index] = { ...existingCharacter, ...character }
        set({ characters: newCharacters })
      },

      deleteCharacter: index => {
        const { characters, selectedCharacterIndex } = get()
        if (characters.length <= 1) return

        const newCharacters = characters.filter((_, i) => i !== index)
        let newSelectedIndex = selectedCharacterIndex

        if (selectedCharacterIndex === index) {
          newSelectedIndex = Math.min(index, newCharacters.length - 1)
        } else if (selectedCharacterIndex > index) {
          newSelectedIndex = selectedCharacterIndex - 1
        }

        set({
          characters: newCharacters,
          selectedCharacterIndex: newSelectedIndex,
        })
      },

      reset: () =>
        set({
          characters: [],
          selectedCharacterIndex: 0,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'CharacterStore',
      enabled: true,
    }
  )
)
