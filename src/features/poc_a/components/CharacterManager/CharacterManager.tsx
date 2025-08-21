import { useCharacterStore } from '@/stores/characterStore'
import { calculateRankedCharacters } from '@/utils/ranking'
import React, { useCallback, useState } from 'react'
import type { Character, CharacterWithRank } from './index'

const CharacterManager: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const {
    characters,
    selectedCharacterIndex,
    setSelectedCharacterIndex,
    addCharacter,
    deleteCharacter,
  } = useCharacterStore()
  const handleSaveToStore = useCallback(() => {
    // 스토어에 저장 (Zustand persist가 자동으로 localStorage에 저장)
    setSaveMessage('캐릭터 데이터가 성공적으로 저장되었습니다!')
    setTimeout(() => setSaveMessage(null), 3000) // 3초 후 메시지 숨김
  }, [])

  const handleAddCharacter = useCallback(() => {
    const newCharacter: Character = {
      name: '새 캐릭터',
      gender: 'male',
      type: 'A',
      score: 50,
      face: '#ff0000',
      body: '#00ff00',
    }
    addCharacter(newCharacter as CharacterWithRank)

    // 새 캐릭터 추가 후 순위 재계산
    setTimeout(() => {
      const { characters } = useCharacterStore.getState()
      const rankedCharacters = calculateRankedCharacters(characters)
      useCharacterStore.getState().setCharacters(rankedCharacters)
    }, 0)
  }, [addCharacter])

  const handleSelectCharacter = useCallback(
    (index: number) => {
      setSelectedCharacterIndex(index)
    },
    [setSelectedCharacterIndex]
  )

  const handleDeleteCharacter = useCallback(
    (index: number) => {
      deleteCharacter(index)

      // 캐릭터 삭제 후 순위 재계산
      setTimeout(() => {
        const { characters } = useCharacterStore.getState()
        const rankedCharacters = calculateRankedCharacters(characters)
        useCharacterStore.getState().setCharacters(rankedCharacters)
      }, 0)
    },
    [deleteCharacter]
  )

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">캐릭터 목록</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddCharacter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + 새 캐릭터 추가
            </button>
            <button
              onClick={handleSaveToStore}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              💾 저장
            </button>
          </div>
        </div>

        {/* 저장 성공 메시지 */}
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 overflow-y-auto">
          {characters.map((character, index) => (
            <div
              key={index}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedCharacterIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectCharacter(index)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-base">{character.name}</h3>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteCharacter(index)
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                  disabled={characters.length <= 1}
                >
                  삭제
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold text-blue-600">
                  순위: {character.rank}위
                </p>
                <p>성별: {character.gender === 'male' ? '남성' : '여성'}</p>
                <p>타입: {character.type}</p>
                <p>점수: {character.score}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs">얼굴:</span>
                  <div
                    className="w-3 h-3 rounded border"
                    style={{
                      backgroundColor: character.face,
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">몸체:</span>
                  <div
                    className="w-3 h-3 rounded border"
                    style={{
                      backgroundColor: character.body,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CharacterManager
