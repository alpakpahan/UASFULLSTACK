'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  description: string
  price: number
}

export default function EditPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Gagal memuat produk:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (
    id: number,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    )
  }

  const handleSave = (product: Product) => {
    fetch(`http://localhost:3001/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (res.ok) {
          alert('Produk berhasil diperbarui!')
        } else {
          alert('Gagal memperbarui produk')
        }
      })
      .catch((err) => console.error('Gagal:', err))
  }

  const handleAddProduct = async () => {
    const { name, description, price } = newProduct
    if (!name || !description || price <= 0) {
      alert(' Semua kolom harus diisi dengan benar.')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (res.ok) {
        const added = await res.json()
        setProducts((prev) => [...prev, added])
        setNewProduct({ name: '', description: '', price: 0 })
        alert('Produk baru berhasil ditambahkan!')
      } else {
        alert('Gagal menambahkan produk')
      }
    } catch (err) {
      console.error('Gagal tambah produk:', err)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    const konfirmasi = confirm('Apakah yakin ingin menghapus produk ini?')
    if (!konfirmasi) return

    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        alert('Produk berhasil dihapus.')
      } else {
        alert('Gagal menghapus produk')
      }
    } catch (err) {
      console.error('Gagal hapus produk:', err)
      alert('Terjadi kesalahan saat menghapus')
    }
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Edit Produk</h1>

      {/* Form Tambah Produk Baru */}
      <div className="bg-white p-6 rounded-xl text-black mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Tambah Produk Baru</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Contoh: Kopi Latte"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Contoh: Kopi dengan susu creamy"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp)</label>
            <input
              type="number"
              value={newProduct.price || ''}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value === '' ? 0 : Number(e.target.value) })
              }
              className="w-full border rounded p-2"
              placeholder="Contoh: 18000"
            />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Daftar Produk */}
      {loading ? (
        <p className="text-blue-600">Memuat data produk...</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700">ID</label>
                <input
                  type="number"
                  value={product.id}
                  disabled
                  className="w-full border rounded p-2 bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nama</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                  className="w-full border rounded p-2 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Deskripsi</label>
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => handleChange(product.id, 'description', e.target.value)}
                  className="w-full border rounded p-2 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  value={product.price || ''}
                  onChange={(e) =>
                    handleChange(product.id, 'price', e.target.value === '' ? 0 : Number(e.target.value))
                  }
                  className="w-full border rounded p-2 text-gray-500"
                />
              </div>

              <div className="col-span-1 md:col-span-4 flex justify-end gap-3 mt-2">
                <button
                  onClick={() => handleSave(product)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
