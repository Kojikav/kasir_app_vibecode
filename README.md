# Aplikasi Kasir Toko — Web POS

Web-based Point of Sale (POS) prototype built with React, Vite, Tailwind CSS, and localStorage.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Demo Login

| Field    | Value       |
| -------- | ----------- |
| Username | `kasir`     |
| Password | `kasir123`  |

## Features

- **Transaksi Penjualan** — Browse products, add to cart, adjust quantities, pay, and print receipt
- **Manajemen Stok** — Add new products with name, price, and initial stock
- **Laporan Harian** — Daily revenue, transaction count, stock status indicators
- **Laporan Bulanan** — Monthly revenue filtered by month/year with stock end-of-period status

## Keyboard Shortcuts

| Shortcut   | Action                  |
| ---------- | ----------------------- |
| `F2`/`Ctrl+C` | Focus search field   |
| `F9`/`Ctrl+B` | Open payment modal   |
| `Enter`    | Confirm payment         |

## Navigate

| Page               | URL                    |
| ------------------ | ---------------------- |
| Login              | `/login`               |
| POS Terminal       | `/transaksi`           |
| Manage Stock       | `/stok`                |
| Daily Report       | `/laporan/harian`      |
| Monthly Report     | `/laporan/bulanan`     |
| Smart Redirect     | `/redirector`          |

## Reset Data

To reset all data (products, transactions, and transaction history back to factory defaults), run this in your browser's developer console:

```js
localStorage.removeItem('kasir_toko_data')
```

Then reload the page. The app will re-initialize with the default 15 seed products and zero transactions.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- localStorage (data persistence)
- Noto Sans (Google Fonts)
# kasir_app_vibecode
