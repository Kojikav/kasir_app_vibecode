import { useState, useEffect } from 'react'
import { getMonthlyReport } from '../data/store'

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function MonthlyReportPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [report, setReport] = useState(null)

  useEffect(() => {
    try {
      setReport(getMonthlyReport(month, year))
    } catch {
      setReport(null)
    }
  }, [month, year])

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  if (!report) return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-sm">Gagal memuat laporan. Silakan coba lagi.</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Laporan Bulanan</h1>
      <p className="text-sm text-slate-500 mb-6">Rekapitulasi pendapatan dan stok bulanan</p>

      <div className="flex items-center gap-3 mb-6">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Bulan</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Tahun</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

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
          <h2 className="font-semibold text-slate-900">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Tanggal</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Bayar</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Kembali</th>
              </tr>
            </thead>
            <tbody>
              {report.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada transaksi pada periode ini.
                  </td>
                </tr>
              ) : (
                report.transactions.map((tx, idx) => (
                  <tr key={tx.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors`}>
                    <td className="px-4 py-3 text-slate-500">#{String(tx.id).padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-slate-700">{new Date(tx.transactionDate).toLocaleDateString('id-ID')}</td>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Status Stok Akhir Periode</h2>
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
    </div>
  )
}
