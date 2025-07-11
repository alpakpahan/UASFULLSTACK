import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white">
      <h1 className="text-5xl font-extrabold leading-tight text-center text-shadow-lg">
        Selamat Datang Kopi Kita
      </h1>
      <p className="mt-4 text-xl opacity-100">Silakan masuk untuk melanjutkan.</p>
      <nav className="mt-8">
        <Link href="/dashboard" className="inline-block px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300">
        Masuk
       </Link>
    </nav>
    </main>
  );
} 