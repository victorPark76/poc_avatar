import type { Character } from '@/features/poc_a/components/CharacterManager/index'

// Mock 데이터 (실제로는 API에서 받아옴)
export const mockCharacters: Character[] = [
  {
    name: 'Mina',
    gender: 'female',
    type: 'B',
    score: 85,
    face: '#a3f94b',
    body: '#1987d4',
  },
  {
    name: 'David',
    gender: 'male',
    type: 'D',
    score: 23,
    face: '#ff8833',
    body: '#62bcf1',
  },
  {
    name: 'Luna',
    gender: 'female',
    type: 'A',
    score: 97,
    face: '#4455ee',
    body: '#eecc77',
  },
  {
    name: 'John',
    gender: 'male',
    type: 'C',
    score: 41,
    face: '#999999',
    body: '#123abc',
  },
  {
    name: 'Emma',
    gender: 'female',
    type: 'B',
    score: 60,
    face: '#cc2288',
    body: '#77eedd',
  },
]
