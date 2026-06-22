import { useState } from 'react'
import { login } from '../data/store'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) { setError('Username harus diisi'); return }
    if (!password.trim()) { setError('Password harus diisi'); return }

    setLoading(true)
    setTimeout(() => {
      try {
        const result = login(username, password)
        setLoading(false)
        if (result.success) {
          onLogin(result.user)
        } else {
          setError(result.message)
        }
      } catch {
        setLoading(false)
        setError('Terjadi kesalahan koneksi. Silakan coba lagi.')
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Kasir Toko</h1>
          <p className="text-slate-500 mt-1">Aplikasi Point of Sale</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Masuk ke Akun</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  error && !username ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  error && !password ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              )}
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Demo: username <strong>kasir</strong> / password <strong>kasir123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
