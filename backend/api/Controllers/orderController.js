import { pool } from '../models/db.js';

// Ambil semua pesanan + itemnya
export const getOrders = async (req, res) => {
  try {
    const ordersRes = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    const orders = ordersRes.rows;

    for (const order of orders) {
      const itemsRes = await pool.query(`
        SELECT 
          p.name, 
          p.price, 
          oi.quantity,
          (p.price * oi.quantity) AS subtotal
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [order.id]);

      order.items = itemsRes.rows;
    }

    res.json(orders);
  } catch (err) {
    console.error('Gagal ambil pesanan:', err);
    res.status(500).json({ error: 'Gagal mengambil data pesanan' });
  }
};

// Tambah pesanan baru
export const createOrder = async (req, res) => {
  const { table_number, note, items } = req.body;

  if (!table_number || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Data pesanan tidak lengkap' });
  }

  try {
    const orderRes = await pool.query(
      'INSERT INTO orders (table_number, note, status) VALUES ($1, $2, $3) RETURNING *',
      [table_number, note || '', 'diproses']
    );
    const order = orderRes.rows[0];

    const insertPromises = items.map(item => {
      return pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [order.id, item.product_id, item.quantity]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({ message: 'Pesanan berhasil dibuat', orderId: order.id });
  } catch (err) {
    console.error('Gagal membuat pesanan:', err);
    res.status(500).json({ error: 'Gagal membuat pesanan' });
  }
};

// Update status pesanan (misal: dari diproses → selesai)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ['diproses', 'selesai'];
  if (!allowedStatus.includes(status?.toLowerCase())) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  try {
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status.toLowerCase(), id]
    );
    res.json({ message: 'Status pesanan berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update status pesanan:', err);
    res.status(500).json({ error: 'Gagal memperbarui status pesanan' });
  }
};

// Hapus pesanan berdasarkan ID
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Hapus item terlebih dahulu
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Hapus pesanan
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    res.json({ message: 'Pesanan berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus pesanan:', err);
    res.status(500).json({ error: 'Gagal menghapus pesanan' });
  }
};
