'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardAdmin() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loginStatus = localStorage.getItem('loginadmin') === 'true'
    if (!loginStatus) {
      router.push('/loginadmin')
    } else {
      setIsLoggedIn(true)
    }
    setIsChecking(false)
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Memeriksa status login...</p>
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tombol Pesanan */}
        <Link
          href="/loginadmin/admin/pesanan" // ✅ arahkan ke lokasi folder baru
          className="bg-white shadow-md rounded-xl p-6 w-64 text-center hover:bg-purple-100 transition"
        >
          <h2 className="text-xl font-semibold text-purple-800">Pesanan</h2>
          <p className="text-sm text-gray-500 mt-2">Lihat daftar dan riwayat pesanan</p>
        </Link>

        {/* Tombol Edit */}
        <Link
          href="/loginadmin/admin/edit"
          className="bg-white shadow-md rounded-xl p-6 w-64 text-center hover:bg-blue-100 transition"
        >
          <h2 className="text-xl font-semibold text-blue-800">Edit</h2>
          <p className="text-sm text-gray-500 mt-2">Edit produk atau pesanan</p>
        </Link>
      </div>
    </main>
  )
}
