import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder // <-- Tambah
} from '../Controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder); // <-- Tambah

export default router;
