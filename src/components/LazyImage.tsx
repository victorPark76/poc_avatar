import { useLazyImage } from '@/hooks/useLazyLoad'
import { Spin } from 'antd'

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
}

export const LazyImage = ({
  src,
  alt,
  placeholder,
  className,
  style,
  width,
  height,
}: LazyImageProps) => {
  const { ref, imageSrc, isLoaded } = useLazyImage<HTMLDivElement>(
    src,
    placeholder
  )

  return (
    <div
      ref={ref}
      className={`relative ${className || ''}`}
      style={{ width, height, ...style }}
    >
      {!isLoaded ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100">
          <Spin size="small" />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  )
}
