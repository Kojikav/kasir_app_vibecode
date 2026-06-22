import { useState, useRef, useEffect } from 'react'
import { saveTransaction } from '../data/store'

export default function PaymentModal({ totalAmount, cart, onClose, onSuccess }) {
  const [amountPaid, setAmountPaid] = useState('')
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState('input') // 'input' | 'confirm' | 'done'
  const [result, setResult] = useState(null)
  const [printBlocked, setPrintBlocked] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (step !== 'confirm') return
    const handleEnter = (e) => {
      if (e.key === 'Enter' && !processing) {
        e.preventDefault()
        handleConfirmPrint()
      }
    }
    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [step, processing])

  const paid = Number(amountPaid) || 0
  const change = paid - totalAmount
  const isEnough = paid >= totalAmount && paid > 0

  const handlePay = () => {
    if (!isEnough) return
    setStep('confirm')
  }

  const handleConfirmPrint = () => {
    setProcessing(true)
    setPrintBlocked(false)
    setTimeout(() => {
      const result = saveTransaction(cart, paid, totalAmount)
      setResult(result)
      setProcessing(false)
      setStep('done')

      setTimeout(() => {
        try {
          const printResult = window.print()
          if (printResult === undefined) {
            const checkOpen = setTimeout(() => {
              setPrintBlocked(true)
            }, 1000)
            window.onafterprint = () => {
              clearTimeout(checkOpen)
              setPrintBlocked(false)
            }
          }
        } catch {
          setPrintBlocked(true)
        }
      }, 500)
    }, 300)
  }

  const handleClose = () => {
    if (result?.success) {
      onSuccess()
    }
    onClose()
  }

  if (step === 'done' && result?.success) {
    const tx = result.transaction
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
        <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Transaksi Berhasil!</h2>
            <p className="text-sm text-slate-500 mt-1">Struk sedang dicetak...</p>
          </div>

          <div id="receipt-print-area" className="bg-white p-4 text-xs max-w-[80mm] mx-auto font-mono">
            <div className="text-center mb-3">
              <p className="font-bold text-sm">TOKO KITA</p>
              <p className="text-slate-500">Jl. Contoh No. 123</p>
              <p>{new Date(tx.transactionDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>{new Date(tx.transactionDate).toLocaleTimeString('id-ID')}</p>
            </div>
            <div className="border-t border-dashed border-slate-300 my-2" />
            <p className="font-bold mb-1">No. {String(tx.id).padStart(4, '0')}</p>
            {tx.details.map((d, i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span className="flex-1">{d.productName}</span>
                <span className="mx-2">{d.quantity}x</span>
                <span className="text-right w-20">Rp {(d.quantity * d.unitPrice).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {tx.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Bayar</span>
              <span>Rp {tx.amountPaid.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Kembali</span>
              <span>Rp {tx.changeAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-dashed border-slate-300 my-2" />
            <p className="text-center text-slate-400">Terima kasih telah berbelanja</p>
          </div>

          {printBlocked && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mt-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Izinkan popup untuk mencetak struk
            </div>
          )}

          <div className="mt-6 space-y-2">
            {printBlocked && (
              <button
                onClick={() => { setPrintBlocked(false); setTimeout(() => { try { window.print() } catch { setPrintBlocked(true) } }, 300) }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all"
              >
                Cetak Ulang Struk
              </button>
            )}
            <button
              onClick={() => { if (result?.success) onSuccess(); onClose() }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium rounded-lg text-sm transition-all"
            >
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Pembayaran</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Tagihan</p>
            <p className="text-3xl lg:text-4xl font-bold text-emerald-600">Rp {totalAmount.toLocaleString('id-ID')}</p>
            <p className="text-xs text-slate-400 mt-1">{cart.length} item</p>
          </div>

          {step === 'confirm' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Total Tagihan</span>
                  <span className="font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Jumlah Bayar</span>
                  <span className="font-semibold">Rp {paid.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-blue-200 my-2" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Kembalian</span>
                  <span className="font-bold text-emerald-600">Rp {change.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmPrint}
                disabled={processing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-300 disabled:text-slate-500 disabled:scale-100 text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : null}
                {processing ? 'Memproses...' : 'Cetak & Selesaikan Transaksi'}
              </button>
              <button
                onClick={() => setStep('input')}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-sm"
              >
                Kembali
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Bayar *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                  <input
                    ref={inputRef}
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-lg font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    min="0"
                  />
                </div>
              </div>

              {paid > 0 && !isEnough && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  Jumlah bayar kurang Rp {(totalAmount - paid).toLocaleString('id-ID')}
                </div>
              )}

              {paid > 0 && isEnough && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span>Kembalian</span>
                  <span className="font-bold text-lg">Rp {change.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 20000, 50000, 100000, 200000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmountPaid(String(val))}
                    className="py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Rp {val.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePay}
                disabled={!isEnough}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 text-white font-medium rounded-lg text-sm transition-all disabled:cursor-not-allowed"
              >
                Bayar Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
