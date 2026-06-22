import { useState, useEffect, useMemo } from 'react'
import { getProducts } from '../data/store'
import ProductCard from '../components/ProductCard'
import CartPanel from '../components/CartPanel'

export default function POSPage() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2' || (e.ctrlKey && (e.key === 'c' || e.key === 'C'))) {
        e.preventDefault()
        document.getElementById('search-product')?.focus()
      }
      if (e.key === 'F9' || (e.ctrlKey && (e.key === 'b' || e.key === 'B'))) {
        e.preventDefault()
        if (cart.length > 0) setShowPayment(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cart.length])

  const filteredProducts = useMemo(() => {
    return getProducts(search).filter(p => p.stockQuantity > 0)
  }, [search, products])

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) return
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          setToast(`Stok "${product.name}" tidak cukup. Sisa: ${product.stockQuantity}`)
          return prev
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId)
      if (!item) return prev
      const newQty = item.quantity + delta
      if (newQty < 1) return prev.filter(i => i.id !== productId)
      const product = products.find(p => p.id === productId)
      if (product && newQty > product.stockQuantity) {
        setToast(`Stok "${product.name}" tidak cukup. Sisa: ${product.stockQuantity}`)
        return prev
      }
      return prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i)
    })
  }

  const removeItem = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleTransactionComplete = () => {
    setCart([])
    setProducts(getProducts())
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Transaksi Penjualan</h1>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">F2/Ctrl+C: Cari</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">F9/Ctrl+B: Bayar</span>
        </div>

        <div className="relative mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            id="search-product"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p className="mt-3 text-sm">Produk tidak ditemukan.</p>
            <p className="text-xs mt-1">Pastikan ejaan nama barang sudah benar atau daftarkan produk baru di menu Kelola Stok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => addToCart(product)}
                cartQuantity={cart.find(c => c.id === product.id)?.quantity || 0}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-[380px] shrink-0">
        <CartPanel
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          totalItems={totalItems}
          totalAmount={totalAmount}
          showPayment={showPayment}
          setShowPayment={setShowPayment}
          onTransactionComplete={handleTransactionComplete}
        />
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {toast}
        </div>
      )}
    </div>
  )
}
