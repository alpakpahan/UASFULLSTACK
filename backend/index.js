import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './api/routes/productRoutes.js';
import orderRoutes from './api/routes/orderRoutes.js';

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3001; // Gunakan dari .env atau fallback ke 3001

// Middleware
app.use(cors()); // Izinkan frontend mengakses backend
app.use(express.json()); // Parsing request body JSON

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Tes koneksi backend (opsional)
app.get('/', (req, res) => {
  res.send('✅ Server kopi API siap!');
});

// Mulai server
app.listen(PORT, () => {
  console.log(`✅ Backend berjalan di http://localhost:${PORT}`);
});
