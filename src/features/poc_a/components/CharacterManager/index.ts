export interface Character {
  name: string
  gender: 'male' | 'female'
  type: 'A' | 'B' | 'C' | 'D'
  score: number
  face: string
  body: string
}

export interface CharacterWithRank extends Character {
  rank: number
}

export { default } from './CharacterManager.tsx'
