import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const shadowClasses = {
  sm: 'shadow',
  md: 'shadow-lg',
  lg: 'shadow-xl',
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl border border-gray-200'
  const paddingClass = paddingClasses[padding]
  const shadowClass = shadowClasses[shadow]

  const classes = `${baseClasses} ${paddingClass} ${shadowClass} ${className}`

  return <div className={classes}>{children}</div>
}
