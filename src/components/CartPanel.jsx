import { useState } from 'react'
import PaymentModal from './PaymentModal'

export default function CartPanel({ cart, onUpdateQuantity, onRemoveItem, onClearCart, totalItems, totalAmount, showPayment, setShowPayment, onTransactionComplete }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-full max-h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Keranjang Belanja
            </h2>
            <span className="text-sm bg-emerald-100 text-emerald-700 font-medium px-2.5 py-0.5 rounded-full">
              {totalItems} item
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <p className="text-sm mt-3">Belum ada item</p>
              <p className="text-xs mt-1">Klik produk untuk menambah ke keranjang</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-200 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-200 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="text-sm font-semibold text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          {cart.length > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total Item</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-semibold">Total Tagihan</span>
                <span className="text-xl font-bold text-emerald-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </>
          )}

          <div className="flex gap-2">
            {cart.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            )}
            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-sm transition-all disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Bayar & Cetak Struk
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          totalAmount={totalAmount}
          cart={cart}
          onClose={() => setShowPayment(false)}
          onSuccess={onTransactionComplete}
        />
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Kosongkan Keranjang</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Apakah Anda yakin ingin menghapus seluruh isi keranjang belanja saat ini?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { onClearCart(); setShowClearConfirm(false) }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all"
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
