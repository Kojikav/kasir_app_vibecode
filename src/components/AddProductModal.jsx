import { useState, useRef, useEffect } from 'react'

export default function AddProductModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus()
  }, [])

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Nama barang harus diisi'
    if (price === '' || Number(price) < 0) errs.price = 'Harga jual tidak boleh bernilai negatif atau kurang dari Rp 0'
    if (stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) errs.stock = 'Stok awal harus berupa bilangan bulat dan tidak boleh negatif'
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      if (errs.name) nameRef.current?.focus()
    }
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      try {
        const result = onSave(name.trim(), Number(price), Number(stock))
        setSaving(false)
        if (!result.success) {
          setErrors({ name: result.message })
        }
      } catch {
        setSaving(false)
        setErrors({ name: 'Gagal menyimpan produk. Silakan coba lagi.' })
      }
    }, 400)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Tambah Produk Baru</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama produk"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  errors.name ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Harga Jual (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kuantitas Stok Awal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  errors.stock ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
              {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-300 disabled:text-slate-500 disabled:scale-100 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
              >
                {saving && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                )}
                {saving ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
