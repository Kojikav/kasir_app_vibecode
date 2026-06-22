import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <button
          onClick={() => navigate('/transaksi')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
