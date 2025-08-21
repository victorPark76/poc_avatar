import { useState } from 'react'
import { Link } from 'react-router-dom'
import CharacterMovementTest from './components/CharacterMovementTest'
import PixiCanvas from './components/PixiCanvas'

export default function PixiPage() {
  const [activeTest, setActiveTest] = useState<'pixi' | 'character'>('pixi')

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Pixi.js 테스트</h1>
          <div className="flex items-center space-x-4">
            {/* 테스트 선택 버튼 */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTest('pixi')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTest === 'pixi'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                기본 Pixi 테스트
              </button>
              <button
                onClick={() => setActiveTest('character')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTest === 'character'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                캐릭터 움직임 테스트
              </button>
            </div>

            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {activeTest === 'pixi' ? (
          <PixiCanvas width={800} height={600} />
        ) : (
          <CharacterMovementTest width={800} height={600} />
        )}
      </div>
    </div>
  )
}
