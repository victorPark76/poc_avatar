import { useEffect } from 'react'

// 리소스 프리로딩 컴포넌트
export const PreloadResources = () => {
  useEffect(() => {
    // 프리로드 경고를 방지하기 위해 실제로 사용되는 리소스만 프리로딩
    // 현재는 프리로드하지 않고 필요할 때 동적 로딩
    console.log('리소스는 필요할 때 동적으로 로딩됩니다.')

    // 중요하지 않은 리소스는 지연 로딩
    const lazyLoadResources = () => {
      // Spine 관련 리소스는 실제로 사용될 때만 로딩
      // modulepreload는 올바른 경로가 필요하므로 제거
      console.log('Spine 리소스는 필요할 때 동적으로 로딩됩니다.')
    }

    // 사용자 상호작용 후 지연 로딩
    const handleUserInteraction = () => {
      lazyLoadResources()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('scroll', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('scroll', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    // 3초 후 자동으로 지연 로딩
    const timeoutId = setTimeout(lazyLoadResources, 3000)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('scroll', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [])

  return null
}
