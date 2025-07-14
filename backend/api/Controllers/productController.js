import { pool } from '../models/db.js';

// Ambil semua produk 
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Gagal ambil produk:', err);
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
};

// Tambah produk
export const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Gagal tambah produk:', err);
    res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
};

// Perbarui produk
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4',
      [name, description, price, id]
    );
    res.json({ message: 'Produk berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update produk:', err);
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
};

// Hapus produk
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus produk:', err);
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
};
