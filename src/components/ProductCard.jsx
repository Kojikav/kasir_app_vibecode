export default function ProductCard({ product, onAdd, cartQuantity }) {
  const outOfStock = product.stockQuantity <= 0
  const stockLabel = product.stockQuantity === 0
    ? { text: 'Habis', cls: 'bg-red-100 text-red-700' }
    : product.stockQuantity <= 5
    ? { text: `Sisa ${product.stockQuantity}`, cls: 'bg-amber-100 text-amber-700' }
    : { text: `Stok ${product.stockQuantity}`, cls: 'bg-emerald-100 text-emerald-700' }

  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md ${outOfStock ? 'opacity-60' : ''}`}>
      <div className="h-20 bg-slate-100 flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-300">
          {product.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-slate-900 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-base font-bold text-emerald-600 mt-1">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockLabel.cls}`}>
            {stockLabel.text}
          </span>
          {cartQuantity > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
              {cartQuantity}x
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          disabled={outOfStock}
          className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 text-white text-xs font-medium rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {outOfStock ? 'Stok Habis' : 'Tambah'}
        </button>
      </div>
    </div>
  )
}
