import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          웹 아바타 애니메이션 R&D
        </h1>

        <div className="mt-8 space-y-3">
          <Link
            to="/poc_spine"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Pixi+spine 페이지
          </Link>
          <Link
            to="/poc_a"
            className="block w-full bg-gray-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Pixi 본애니를 해봄
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}
