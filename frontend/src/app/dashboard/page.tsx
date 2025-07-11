'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type CartItem = Product & {
  quantity: number;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('15');

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Gagal fetch produk:', err));
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedTable = localStorage.getItem('tableNumber');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedTable) setTableNumber(storedTable);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tableNumber', tableNumber);
  }, [tableNumber]);

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      const updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updated);
  };

  const getQuantity = (id: number) =>
    cart.find((item) => item.id === id)?.quantity || 0;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white">
      
      <div className="absolute top-6 left-6 flex flex-col items-start gap-2">
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Meja"
          className="w-24 text-2xl font-bold text-white border-b-2 border-white bg-transparent focus:outline-none text-center"
        />
        <button
          onClick={() => window.history.back()}
          className="bg-purple-200 hover:bg-purple-300 text-purple-800 font-semibold py-1 px-3 rounded transition"
          >
            kembali
        </button>
      </div>

      {/* Keranjang */}
      <div className="absolute top-6 right-6">
        <Link href="/cart">
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-white text-3xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Konten utama */}
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6">
          Menu
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500">Memuat produk...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow hover:shadow-md transition block"
              >
                <h2 className="text-2xl font-semibold text-purple-800 mb-1">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  {product.description}
                </p>
                <p className="text-sm text-purple-700 font-semibold mb-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>

                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="bg-purple-200 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-300"
                  >
                    <AiOutlineMinus />
                  </button>

                  <span className="text-lg font-semibold text-purple-800 w-6 text-center">
                    {getQuantity(product.id)}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-600 text-white px-2 py-1 rounded-full hover:bg-purple-700"
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
