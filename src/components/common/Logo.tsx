interface LogoProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export default function Logo({
  src,
  alt,
  size = 'md',
  href,
  className = '',
}: LogoProps) {
  const sizeClass = sizeClasses[size]
  const baseClasses = 'hover:scale-110 transition-transform'
  const classes = `${baseClasses} ${sizeClass} ${className}`

  const logoElement = <img src={src} className={classes} alt={alt} />

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {logoElement}
      </a>
    )
  }

  return logoElement
}
