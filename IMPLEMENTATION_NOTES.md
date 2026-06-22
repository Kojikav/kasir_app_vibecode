# Implementation Notes

## Architecture

- **Framework:** React 18 + Vite 5 + Tailwind CSS 3 + React Router 6
- **State Management:** React built-in hooks (useState, useEffect, useMemo) — no Redux/Zustand
- **Data Persistence:** localStorage via a thin `store.js` module that mimics a backend data layer
- **Routing:** BrowserRouter with protected/public route guards and a `/redirector` entry point

All four Source of Truth documents (SRS v0.2, IA v1.0, Design System v1.0, User Flows v1.0) from `docs/` were followed. Where conflicts existed, SRS (SoT-1) was treated as the highest priority.

## Deviation from SoT Documents

| # | Document | Item | Decision |
|---|----------|------|----------|
| 1 | Test Cases / User Flows | Login test data: `kasir01` / `password123` | Prototype uses `kasir` / `kasir123` as defined in `store.js` seed data |
| 2 | SRS Section 2.4 | Backend stack (Node.js/Python/Go) + PostgreSQL/MySQL | Prototype uses localStorage-only frontend (no backend) per project scope |
| 3 | SRS Section 6.2 | HttpOnly Cookie for session token | Prototype uses `sessionStorage` (appropriate for frontend-only demo) |
| 4 | UC-004 | Test cases mention "Kategori" field in Add Product form | Not implemented — the field does not exist in SRS F002 requirements (only Nama Barang, Harga Jual, Kuantitas Stok Awal) or the data model |
| 5 | SRS F003 | "Data laporan harian akan otomatis dikunci dan diarsipkan di sistem setiap pergantian hari" | Not implemented — no archival mechanism exists; reports pull live data from localStorage |

## Data Layer

The `src/data/store.js` module provides all CRUD operations:

- `login(username, password)` — validates against single user
- `getProducts(search?)` — lists/search products
- `addProduct(name, price, stockQuantity)` — validates and inserts
- `saveTransaction(cartItems, amountPaid, totalAmount)` — saves transaction + reduces stock
- `getDailyReport()` — aggregates today's transactions + product status
- `getMonthlyReport(month, year)` — filters by month/year

All data is initialized with 15 seed products on first load (or after localStorage is cleared).

## Keyboard Shortcuts

| Shortcut | Action | Source |
|----------|--------|--------|
| F2 / Ctrl+C | Focus search field | Design System / UC-002 AF-002 |
| F9 / Ctrl+B | Open payment modal | Design System / UC-002 |
| Enter | Confirm payment (confirm step) | Design System |

## Component Tree

```
App
├── PublicRoute
│   └── LoginPage
├── ProtectedLayout
│   ├── Sidebar (3-state: expanded / collapsed / hidden)
│   ├── Header (user menu, hamburger toggle)
│   └── <page>
│       ├── POSPage
│       │   ├── ProductCard (grid)
│       │   ├── CartPanel
│       │   └── PaymentModal (input → confirm → done)
│       ├── StockPage
│       │   └── AddProductModal
│       ├── DailyReportPage
│       └── MonthlyReportPage
├── Redirector
└── NotFoundPage (404)
```

## Error Handling Coverage

| Scenario | Location | Message |
|----------|----------|---------|
| Wrong credentials | LoginPage | "Username atau password salah" |
| Empty login fields | LoginPage | "Username harus diisi" / "Password harus diisi" |
| Server connection error | LoginPage | "Terjadi kesalahan koneksi. Silakan coba lagi." |
| Stock insufficient | POSPage | Toast: "Stok \"{name}\" tidak cukup. Sisa: {qty}" |
| Out of stock product | ProductCard | "Habis" badge + disabled button |
| Empty cart at payment | CartPanel | Button disabled |
| Print dialog blocked | PaymentModal | "Izinkan popup untuk mencetak struk" + retry button |
| Duplicate product name | AddProductModal | "Nama produk sudah ada" |
| Negative price/stock | AddProductModal | Validation error per field |
| Server save error | AddProductModal | "Gagal menyimpan produk. Silakan coba lagi." |
| Load report error | DailyReportPage / MonthlyReportPage | "Gagal memuat laporan. Silakan coba lagi." |
| Session active | PublicRoute | Redirect to /transaksi |
