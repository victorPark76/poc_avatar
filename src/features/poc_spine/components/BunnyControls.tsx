import React from 'react'

interface BunnyControlsProps {
  bunnyPosition: { x: number; y: number }
  bunnyBtnView: boolean
  isDragging: boolean
  onToggleView: () => void
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void
  onMoveLeft: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveRight: () => void
}

export const BunnyControls: React.FC<BunnyControlsProps> = ({
  bunnyPosition,
  bunnyBtnView,
  isDragging,
  onToggleView,
  onDragStart,
  onMoveLeft,
  onMoveUp,
  onMoveDown,
  onMoveRight,
}) => {
  return (
    <div
      id="bunny-btn-view"
      className="absolute z-[99999]"
      style={{
        position: 'absolute',
        left: `${bunnyPosition.x}%`,
        top: `${bunnyPosition.y + 5}%`, // bunny 캐릭터 발쪽에 위치하도록 5% 오프셋 추가
        transform: 'translateX(-50%)', // 중앙 정렬을 위한 변환
      }}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex gap-[3px]">
          <button
            id="bunny-btn-view-toggle"
            onClick={() => {
              if (!isDragging) {
                onToggleView()
              }
            }}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            className={`text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors cursor-move select-none ${
              isDragging
                ? 'bg-blue-700 shadow-lg scale-105'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            style={{ userSelect: 'none', touchAction: 'none' }}
          >
            {bunnyBtnView ? 'Hide' : 'Show'}
          </button>
          {bunnyBtnView && (
            <>
              <button
                onClick={onMoveLeft}
                className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                ←
              </button>
              <button
                onClick={onMoveUp}
                className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                ↑
              </button>
              <button
                onClick={onMoveDown}
                className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                ↓
              </button>
              <button
                onClick={onMoveRight}
                className="bg-blue-500 hover:bg-blue-600 text-white h-[42px] w-[42px] rounded text-sm font-medium transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
