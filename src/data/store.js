const STORAGE_KEY = 'kasir_toko_data'

const defaultData = {
  user: { id: 1, username: 'kasir', password: 'kasir123', fullName: 'Kasir Utama', role: 'kasir' },
  products: [
    { id: 1, name: 'Air Mineral 600ml', price: 3000, stockQuantity: 50 },
    { id: 2, name: 'Mie Instan Goreng', price: 3500, stockQuantity: 30 },
    { id: 3, name: 'Mie Instan Kuah', price: 3500, stockQuantity: 25 },
    { id: 4, name: 'Biskuit Coklat', price: 7500, stockQuantity: 15 },
    { id: 5, name: 'Sabun Mandi Cair', price: 18500, stockQuantity: 10 },
    { id: 6, name: 'Shampoo Sachet', price: 1500, stockQuantity: 100 },
    { id: 7, name: 'Kopi Bubuk 250gr', price: 25000, stockQuantity: 8 },
    { id: 8, name: 'Gula Pasir 1kg', price: 16000, stockQuantity: 0 },
    { id: 9, name: 'Minyak Goreng 1L', price: 22000, stockQuantity: 5 },
    { id: 10, name: 'Telur Ayam 1kg', price: 30000, stockQuantity: 12 },
    { id: 11, name: 'Beras Premium 5kg', price: 75000, stockQuantity: 7 },
    { id: 12, name: 'Kecap Manis 600ml', price: 12000, stockQuantity: 4 },
    { id: 13, name: 'Saos Sambal 300ml', price: 9000, stockQuantity: 6 },
    { id: 14, name: 'Susu Kental Manis', price: 11000, stockQuantity: 20 },
    { id: 15, name: 'Teh Celup 25s', price: 8500, stockQuantity: 3 },
  ],
  transactions: [],
  nextProductId: 16,
  nextTransactionId: 1,
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...defaultData, ...parsed }
    }
  } catch (_) { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultData))
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

let data = loadData()

export function getStore() {
  return data
}

export function login(username, password) {
  if (data.user.username === username && data.user.password === password) {
    return { success: true, user: { id: data.user.id, username: data.user.username, fullName: data.user.fullName, role: data.user.role } }
  }
  return { success: false, message: 'Username atau password salah' }
}

export function getProducts(search = '') {
  const list = data.products || []
  if (!search) return [...list]
  return list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
}

export function getProductById(id) {
  return data.products.find(p => p.id === id)
}

export function addProduct(name, price, stockQuantity) {
  const exists = data.products.some(p => p.name.toLowerCase() === name.toLowerCase())
  if (exists) return { success: false, message: 'Nama produk sudah ada' }
  const product = {
    id: data.nextProductId++,
    name,
    price: Number(price),
    stockQuantity: Number(stockQuantity),
  }
  data.products.push(product)
  saveData(data)
  return { success: true, product }
}

export function saveTransaction(cartItems, amountPaid, totalAmount) {
  const changeAmount = amountPaid - totalAmount
  const transaction = {
    id: data.nextTransactionId++,
    totalAmount,
    amountPaid,
    changeAmount,
    transactionDate: new Date().toISOString(),
    status: 'completed',
    details: cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.quantity * item.price,
    })),
  }
  for (const item of cartItems) {
    const product = data.products.find(p => p.id === item.id)
    if (product) {
      product.stockQuantity -= item.quantity
    }
  }
  data.transactions.push(transaction)
  saveData(data)
  return { success: true, transaction }
}

export function getDailyReport() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()
  const todayTx = data.transactions.filter(t => {
    const txDate = new Date(t.transactionDate)
    txDate.setHours(0, 0, 0, 0)
    return txDate.getTime() === today.getTime()
  })
  const totalRevenue = todayTx.reduce((sum, t) => sum + t.totalAmount, 0)
  const totalTx = todayTx.length
  const avgTx = totalTx > 0 ? totalRevenue / totalTx : 0
  const products = data.products.map(p => ({
    ...p,
    stockStatus: p.stockQuantity === 0 ? 'habis' : p.stockQuantity <= 5 ? 'menipis' : 'aman',
  }))
  return { totalRevenue, totalTransactions: totalTx, averageTransaction: avgTx, transactions: todayTx, products }
}

export function getMonthlyReport(month, year) {
  const filtered = data.transactions.filter(t => {
    const d = new Date(t.transactionDate)
    return d.getMonth() === month && d.getFullYear() === year
  })
  const totalRevenue = filtered.reduce((sum, t) => sum + t.totalAmount, 0)
  const totalTx = filtered.length
  const avgTx = totalTx > 0 ? totalRevenue / totalTx : 0
  const products = data.products.map(p => ({
    ...p,
    stockStatus: p.stockQuantity === 0 ? 'habis' : p.stockQuantity <= 5 ? 'menipis' : 'aman',
  }))
  return { totalRevenue, totalTransactions: totalTx, averageTransaction: avgTx, transactions: filtered, products }
}
