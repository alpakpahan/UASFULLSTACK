'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

type CartItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type RecentOrder = {
  id: number;
  table_number: string;
  note: string;
  created_at: string;
  status: 'diproses' | 'selesai';
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [note, setNote] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('recentOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders) as any[];
      const orders: RecentOrder[] = parsedOrders.map((order) => ({
        ...order,
        status: order.status === 'selesai' ? 'selesai' : 'diproses',
      }));
      setRecentOrders(orders);
    }

    const storedCart = localStorage.getItem('cart');
    const storedTable = localStorage.getItem('tableNumber');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedTable) setTableNumber(storedTable);
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProcessOrder = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong! Tambahkan produk dulu.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNumber || 'Tanpa Meja',
          note: note.trim(),
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const newOrder: RecentOrder = {
          id: data.orderId,
          table_number: tableNumber,
          note,
          created_at: new Date().toISOString(),
          status: 'diproses',
          items: [...cart],
        };

        const updatedOrders = [...recentOrders, newOrder];
        setRecentOrders(updatedOrders);
        localStorage.setItem('recentOrders', JSON.stringify(updatedOrders));

        alert('Pesanan berhasil dikirim!');
        localStorage.removeItem('cart');
        setCart([]);
        setNote('');
      } else {
        alert('Gagal memproses pesanan: ' + data.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error);
    }
  };

  const handleConfirmFinish = (orderId: number) => {
    const updatedOrders = recentOrders.filter((order) => order.id !== orderId);
    setRecentOrders(updatedOrders);
    localStorage.setItem('recentOrders', JSON.stringify(updatedOrders));
  };

  return (
    <>
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 bg-purple-200 hover:bg-purple-300 text-purple-800 font-semibold py-2 px-4 rounded-lg transition font-sans"
      >
        Kembali ke Menu
      </button>

      <main className="min-h-screen flex flex-col center items-center bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white">
        <h1 className="text-4xl font-bold text-white-700 mb-5 flex items-center gap-4 mt-20">
          <FaShoppingCart />
          Keranjang
        </h1>

        {cart.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-300 text-purple-800">
                  <th className="pb-3">Produk</th>
                  <th className="pb-3 text-center">Jumlah</th>
                  <th className="pb-3 text-right">Harga Satuan</th>
                  <th className="pb-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-purple-100 text-purple-900">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                <tr className="text-purple-900 font-bold">
                  <td colSpan={3} className="pt-4 text-right">
                    Total Harga
                  </td>
                  <td className="pt-4 text-right">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6">
              <label className="block text-purple-800 font-medium mb-2">
                Catatan :
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-24 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
              />
            </div>

            <button
              onClick={handleProcessOrder}
              className="mt-8 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg transition font-sans"
            >
              Proses Pesanan
            </button>
          </div>
        )}

        {/* === Riwayat Pesanan === */}
        {recentOrders.map((recentOrder) => (
          <div
            key={recentOrder.id}
            className="mt-10 bg-green-50 border border-green-300 rounded-lg p-6 w-full max-w-3xl"
          >
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Pesanan ({recentOrder.status})
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Meja: {recentOrder.table_number || 'Tanpa Meja'} <br />
              Catatan: {recentOrder.note || '-'} <br />
              Waktu: {new Date(recentOrder.created_at).toLocaleString()}
            </p>

            <table className="w-full text-left border-collapse mt-4 text-green-900">
              <thead>
                <tr className="border-b border-green-300 font-semibold">
                  <th className="py-2">Produk</th>
                  <th className="py-2 text-center">Jumlah</th>
                  <th className="py-2 text-right">Harga</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrder.items.map((item) => (
                  <tr key={item.id} className="border-b border-green-100">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">
                      Rp {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={3} className="pt-4 text-right">
                    Total
                  </td>
                  <td className="pt-4 text-right">
                    Rp {recentOrder.items
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            {recentOrder.status === 'diproses' && (
              <button
                onClick={() => handleConfirmFinish(recentOrder.id)}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Selesai
              </button>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
