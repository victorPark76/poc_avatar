import PixiPage from '@/features/pixi/PixiPage'
import Test from '@/features/test'
import HomePage from '@/pages/HomePage'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test_pixi" element={<PixiPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  )
}
