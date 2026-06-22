import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

const menuItems = [
  { label: 'Transaksi', path: '/transaksi', icon: 'shopping-cart' },
  { label: 'Kelola Stok', path: '/stok', icon: 'package' },
  { label: 'Laporan Harian', path: '/laporan/harian', icon: 'calendar' },
  { label: 'Laporan Bulanan', path: '/laporan/bulanan', icon: 'trending-up' },
]

function getViewportWidth() {
  return window.innerWidth
}

function getDefaultMode(width) {
  if (width < 768) return 'hidden'
  if (width < 1024) return 'collapsed'
  return 'expanded'
}

export default function Layout({ children, user, onLogout }) {
  const [sidebarMode, setSidebarMode] = useState(() => getDefaultMode(getViewportWidth()))
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      const w = getViewportWidth()
      setSidebarMode(prev => {
        if (w < 768) return 'hidden'
        if (w < 1024) {
          if (prev === 'expanded') return 'collapsed'
          return 'hidden'
        }
        if (prev === 'hidden') return 'expanded'
        return prev
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isDesktop = getViewportWidth() >= 1024 || sidebarMode !== 'hidden'

  const handleToggle = () => {
    setSidebarMode(prev => prev === 'hidden' ? 'expanded' : 'hidden')
  }

  const handleCollapse = () => {
    setSidebarMode('collapsed')
  }

  const handleExpand = () => {
    setSidebarMode('expanded')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        items={menuItems}
        activePath={location.pathname}
        onNavigate={(path) => { navigate(path) }}
        mode={sidebarMode}
        onToggle={handleToggle}
        onCollapse={handleCollapse}
        onExpand={handleExpand}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-6 shadow-md sticky top-0 z-10">
          {sidebarMode === 'hidden' && (
            <button
              onClick={handleToggle}
              className="p-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          {sidebarMode === 'collapsed' && (
            <button
              onClick={handleExpand}
              className="hidden md:flex lg:hidden p-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Expand sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="9 18 3 12 9 6"/></svg>
            </button>
          )}
          <div className="flex-1" />

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg text-sm"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className="hidden sm:inline text-slate-700 font-medium">{user.fullName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.username}</p>
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout() }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
