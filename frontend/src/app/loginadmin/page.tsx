'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginAdmin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'kopi' && password === 'kopi123') {
      localStorage.setItem('loginadmin', 'true')
      router.push('/loginadmin/admin/dashboardadmin')
    } else {
      setError('Username atau password salah!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login Admin
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <div className="mb-5">
          <label className="block text-gray-800 font-medium text-sm mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full p-3 border border-gray-300 rounded text-gray-900 text-base font-semibold focus:outline-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 font-medium text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full p-3 border border-gray-300 rounded text-gray-900 text-base font-semibold focus:outline-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold text-lg"
        >
          Masuk
        </button>
      </form>
    </div>
  )
}
