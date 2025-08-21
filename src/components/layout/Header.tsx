import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children?: ReactNode
  className?: string
}

export default function Header({
  title,
  children,
  className = '',
}: HeaderProps) {
  return (
    <header className={`bg-gray-800 p-4 border-b border-gray-700 ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {children}
      </div>
    </header>
  )
}
