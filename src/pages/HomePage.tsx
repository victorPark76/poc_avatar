import reactLogo from '@/assets/react.svg'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import viteLogo from '/vite.svg'

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center space-x-8 mb-8">
          <a
            href="https://vite.dev"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <img
              src={reactLogo}
              className="h-16 w-16 animate-spin-slow"
              alt="React logo"
            />
          </a>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Vite + React</h1>

        <div className="space-y-4">
          <button
            onClick={() => setCount(count => count + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Count is {count}
          </button>

          <p className="text-gray-600">
            Edit{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              src/App.tsx
            </code>{' '}
            and save to test HMR
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            to="/poc_a"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Pixi.js POC_A 페이지
          </Link>
          <Link
            to="/poc_spine"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Pixi+spine 페이지
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}
