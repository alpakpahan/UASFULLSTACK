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
  const { name, description, price, slug } = req.body;

  if (!name || !description || !price || !slug) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, slug) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, slug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Gagal tambah produk:', err);
    res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
};

// Update produk
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, slug } = req.body;

  if (!name || !description || !price || !slug) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, slug = $4 WHERE id = $5',
      [name, description, price, slug, id]
    );
    res.json({ message: 'Produk berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update produk:', err);
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
};

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
