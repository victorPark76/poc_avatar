import CharacterManager from '@/features/poc_a/components/CharacterManager/index'
import Screen from '@/features/poc_a/components/CloudScene'
import JsonEditor from '@/features/poc_a/components/JsonEditor'
import { useCharacterStore } from '@/stores/characterStore'
import { useScreenSizeStore } from '@/stores/screenSizeStore'
import {
  useCharacterData,
  useCharacterManagement,
  useCloudConfiguration,
  useScreenResize,
} from './hooks'

// Mock 데이터 (실제로는 API에서 받아옴)
const Test = () => {
  const { height } = useScreenSizeStore()
  const { characters, isLoading } = useCharacterStore()

  // 커스텀 훅들 사용
  useScreenResize()
  const clouds = useCloudConfiguration(height)
  const { error } = useCharacterData()
  const { characterData, handleCharacterChange } = useCharacterManagement()

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <div className="bg-[#ff0000] w-full">
          <h1 className="text-4xl font-bold">캐릭터 데이터</h1>
        </div>
        <div className="flex-1 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 text-lg font-medium">
              캐릭터 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <div className="bg-[#ff0000] w-full">
          <h1 className="text-4xl font-bold">캐릭터 데이터</h1>
        </div>
        <div className="flex-1 flex justify-center items-center min-h-[400px] bg-red-100 border border-red-400 text-red-700">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">오류가 발생했습니다</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <div className="bg-[#ff0000] w-full">
        <h1 className="text-4xl font-bold">캐릭터 데이터</h1>
      </div>

      {/* 스키크린 */}
      <Screen
        clouds={clouds}
        background={0x87ceeb}
        backgroundSrc="/images/background_trimmed2.png"
      />

      {/* 캐릭터 목록 */}
      <div className="flex-1 w-full">
        {characters.length > 0 ? (
          <CharacterManager />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 text-lg">캐릭터 데이터가 없습니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* JSON 에디터 */}
      {characterData && (
        <div className="w-full mx-auto">
          <JsonEditor
            initialData={characterData}
            onChange={handleCharacterChange}
            title={`${characterData.name} 캐릭터 데이터 에디터`}
          />
        </div>
      )}
    </div>
  )
}

export default Test
