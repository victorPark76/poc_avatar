import Bon from '@/features/bon'
import PocA from '@/features/poc_a'
import PocSpine from '@/features/poc_spine'
import HomePage from '@/pages/HomePage'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/poc_a" element={<PocA />} />
      <Route path="/poc_spine" element={<PocSpine />} />
      <Route path="/bon" element={<Bon />} />
    </Routes>
  )
}
