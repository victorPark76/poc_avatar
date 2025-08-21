import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ScreenSizeState {
  width: number
  height: number
  setScreenSize: (width: number, height: number) => void
  setWidth: (width: number) => void
}

// 초기값을 한 번만 계산
const getInitialSize = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: Math.round(window.innerWidth * (3 / 4)),
    }
  }
  return {
    width: 1920,
    height: 1440,
  }
}

const initialSize = getInitialSize()

export const useScreenSizeStore = create<ScreenSizeState>()(
  devtools(
    set => ({
      width: initialSize.width,
      height: initialSize.height,

      setScreenSize: (width: number, height: number) => set({ width, height }),

      setWidth: (width: number) =>
        set(() => ({
          width,
          height: Math.round(width * (3 / 4)),
        })),
    }),
    {
      name: 'Avatar_ScreenSizeStore',
      enabled: true,
    }
  )
)
