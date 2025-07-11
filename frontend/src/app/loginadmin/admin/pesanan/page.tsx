'use client';

import { useEffect, useState } from 'react';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  table_number: string;
  note: string;
  created_at: string;
  status: 'diproses' | 'selesai';
  items: OrderItem[];
};

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Gagal fetch pesanan:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (orderId: number) => {
    const res = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'selesai' })
    });

    if (res.ok) {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'selesai' } : order
        )
      );
    } else {
      alert('Gagal memperbarui status pesanan.');
    }
  };

  const handleDelete = async (orderId: number, status: 'diproses' | 'selesai') => {
    if (status !== 'selesai') {
      alert('Hanya pesanan dengan status selesai yang dapat dihapus.');
      return;
    }

    const confirmed = confirm('Yakin ingin menghapus pesanan ini?');
    if (!confirmed) return;

    const res = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } else {
      alert('Gagal menghapus pesanan.');
    }
  };

  return (
    <main className="min-h-screen bg-purple-50 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Pesanan</h1>

      {loading ? (
        <p className="text-purple-700">Memuat data pesanan...</p>
      ) : orders.length === 0 ? (
        <p className="text-purple-700">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-purple-700">Meja: {order.table_number}</h2>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                </div>

                {order.note && (
                  <p className="text-sm italic text-purple-600 mb-2">Catatan: {order.note}</p>
                )}

                <p className="text-sm font-medium mb-2 text-gray-700">
                  Status:{' '}
                  <span className={order.status === 'selesai' ? 'text-green-600' : 'text-orange-600'}>
                    {order.status === 'selesai' ? 'Selesai' : 'Diproses'}
                  </span>
                </p>

                <table className="w-full text-sm text-purple-900 border-t border-purple-200 mt-3">
                  <thead>
                    <tr>
                      <th className="py-2 text-left">Produk</th>
                      <th className="py-2 text-center">Jumlah</th>
                      <th className="py-2 text-right">Harga</th>
                      <th className="py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t border-purple-100">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                        <td className="py-2 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t border-purple-300">
                      <td colSpan={3} className="py-2 text-right">Total</td>
                      <td className="py-2 text-right text-purple-800">Rp {total.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-4 flex gap-4">
                  {order.status === 'diproses' && (
                    <button
                      onClick={() => handleConfirm(order.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Tandai Selesai
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(order.id, order.status)}
                    className={`px-4 py-2 rounded text-white ${
                      order.status === 'selesai'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={order.status !== 'selesai'}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
