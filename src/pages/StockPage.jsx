import { useState, useEffect, useMemo } from 'react'
import { getProducts, addProduct } from '../data/store'
import AddProductModal from '../components/AddProductModal'

export default function StockPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  const filtered = useMemo(() => {
    return getProducts(search)
  }, [search, products])

  const handleAddProduct = (name, price, stock) => {
    const result = addProduct(name, price, stock)
    if (result.success) {
      setProducts(getProducts())
      setShowModal(false)
    }
    return result
  }

  const getStockBadge = (qty) => {
    if (qty === 0) return { text: 'Habis', cls: 'bg-red-100 text-red-700' }
    if (qty <= 5) return { text: 'Menipis', cls: 'bg-amber-100 text-amber-700' }
    return { text: 'Aman', cls: 'bg-emerald-100 text-emerald-700' }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Stok Barang</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Barang Baru
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari barang..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="hidden md:table-cell text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Nama Barang</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Harga Jual</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Stok Aktual</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    {search ? 'Produk tidak ditemukan.' : 'Belum ada produk terdaftar.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const badge = getStockBadge(p.stockQuantity)
                  return (
                    <tr key={p.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors`}>
                      <td className="hidden md:table-cell px-4 py-3 text-slate-500">#{String(p.id).padStart(3, '0')}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                      <td className="px-4 py-3 text-right font-medium">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-center">{p.stockQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  )
}
