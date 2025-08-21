import { useEffect, useRef, useState } from 'react'

// Intersection Observer를 활용한 지연 로딩 훅
export const useLazyLoad = <T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true)
          setHasLoaded(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [hasLoaded, options])

  return { ref, isIntersecting, hasLoaded }
}

// 이미지 지연 로딩 훅
export const useLazyImage = <T extends HTMLElement = HTMLElement>(
  src: string,
  placeholder?: string
) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, isIntersecting } = useLazyLoad<T>()

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        console.error('Failed to load image:', src)
      }
      img.src = src
    }
  }, [isIntersecting, src])

  return { ref, imageSrc, isLoaded }
}
