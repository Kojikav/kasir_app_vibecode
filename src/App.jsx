import { useState, useCallback } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import POSPage from './pages/POSPage'
import StockPage from './pages/StockPage'
import DailyReportPage from './pages/DailyReportPage'
import MonthlyReportPage from './pages/MonthlyReportPage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'

function ProtectedLayout({ user, onLogout, children }) {
  if (!user) return <Navigate to="/login" replace />
  return <Layout user={user} onLogout={onLogout}>{children}</Layout>
}

function PublicRoute({ user, children }) {
  if (user) return <Navigate to="/transaksi" replace />
  return children
}

function Redirector() {
  const stored = sessionStorage.getItem('kasir_user')
  if (stored) return <Navigate to="/transaksi" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('kasir_user')
    return stored ? JSON.parse(stored) : null
  })

  const handleLogin = useCallback((userData) => {
    sessionStorage.setItem('kasir_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('kasir_user')
    setUser(null)
  }, [])

  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute user={user}>
          <LoginPage onLogin={handleLogin} />
        </PublicRoute>
      } />
      <Route path="/redirector" element={<Redirector />} />

      <Route path="/transaksi" element={
        <ProtectedLayout user={user} onLogout={handleLogout}><POSPage /></ProtectedLayout>
      } />
      <Route path="/stok" element={
        <ProtectedLayout user={user} onLogout={handleLogout}><StockPage /></ProtectedLayout>
      } />
      <Route path="/laporan/harian" element={
        <ProtectedLayout user={user} onLogout={handleLogout}><DailyReportPage /></ProtectedLayout>
      } />
      <Route path="/laporan/bulanan" element={
        <ProtectedLayout user={user} onLogout={handleLogout}><MonthlyReportPage /></ProtectedLayout>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
