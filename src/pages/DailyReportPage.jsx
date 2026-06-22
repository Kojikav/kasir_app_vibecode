import { useState, useEffect } from 'react'
import { getDailyReport } from '../data/store'

export default function DailyReportPage() {
  const [report, setReport] = useState(null)
  const [selectedTx, setSelectedTx] = useState(null)

  useEffect(() => {
    try {
      setReport(getDailyReport())
    } catch {
      setReport(null)
    }
  }, [])

  if (!report) return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-sm">Gagal memuat laporan. Silakan coba lagi.</p>
    </div>
  )

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Laporan Harian</h1>
      <p className="text-sm text-slate-500 mb-6">{today}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-emerald-600">
            Rp {report.totalRevenue.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Jumlah Transaksi</p>
          <p className="text-2xl font-bold text-slate-900">{report.totalTransactions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Rata-rata Transaksi</p>
          <p className="text-2xl font-bold text-slate-900">
            Rp {Math.round(report.averageTransaction).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Status Stok Barang</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Nama Barang</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Harga</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Sisa Stok</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.products
                .sort((a, b) => a.stockQuantity - b.stockQuantity)
                .map((p, idx) => {
                  const isLow = p.stockQuantity <= 5
                  return (
                    <tr key={p.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                      <td className={`px-4 py-3 font-medium ${isLow ? 'text-red-900' : 'text-slate-900'}`}>{p.name}</td>
                      <td className={`px-4 py-3 text-right ${isLow ? 'text-red-700' : 'text-slate-700'}`}>Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className={`px-4 py-3 text-center font-bold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>{p.stockQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          p.stockStatus === 'aman' ? 'bg-emerald-100 text-emerald-700' :
                          p.stockStatus === 'menipis' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {p.stockStatus === 'aman' ? 'Aman' : p.stockStatus === 'menipis' ? 'Menipis' : 'Habis'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Riwayat Transaksi Hari Ini</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Waktu</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Bayar</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Kembali</th>
              </tr>
            </thead>
            <tbody>
              {report.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    Belum ada transaksi hari ini.
                  </td>
                </tr>
              ) : (
                report.transactions.map((tx, idx) => (
                  <tr key={tx.id} onClick={() => setSelectedTx(tx)} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors cursor-pointer`}>
                    <td className="px-4 py-3 text-slate-500">#{String(tx.id).padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-slate-700">{new Date(tx.transactionDate).toLocaleTimeString('id-ID')}</td>
                    <td className="px-4 py-3 text-right font-medium">Rp {tx.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-right">Rp {tx.amountPaid.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-right">Rp {tx.changeAmount.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTx(null)}>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Detail Transaksi #{String(selectedTx.id).padStart(4, '0')}</h3>
              <button onClick={() => setSelectedTx(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">{new Date(selectedTx.transactionDate).toLocaleString('id-ID')}</p>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2 mb-4">
              {selectedTx.details.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="text-slate-900">{d.productName}</span>
                    <span className="text-slate-500 ml-1">x{d.quantity}</span>
                  </div>
                  <span className="font-medium">Rp {d.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-bold text-slate-900">Rp {selectedTx.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Bayar</span>
                <span>Rp {selectedTx.amountPaid.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Kembali</span>
                <span className="text-emerald-600 font-medium">Rp {selectedTx.changeAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
