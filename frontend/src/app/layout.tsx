import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kopi',
  description: 'Aplikasi Pemesanan Kopi Modern',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} text-purple-800`}>
        {/* Gambar background */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center blur-sm opacity-50"
          style={{ backgroundImage: "url('/gambar-kopi.jpg')" }}
        />

        {/* Overlay untuk kontras */}
        <div className="fixed inset-0 bg-black/30 z-0" />

        {/* Konten utama */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
