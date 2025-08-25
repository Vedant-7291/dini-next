// server/routes/orders.js
const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');

router.get('/', getOrders);
router.get('/stats', getOrderStats); // Add this line
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;