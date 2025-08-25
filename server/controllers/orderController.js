// server/controllers/orderController.js
const Order = require('../models/Order');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { tableNumber, items, totalAmount, paymentMethod } = req.body;
    
    const order = new Order({
      tableNumber,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'pending' // Set as pending initially
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'completed') {
      order.completedAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics for dashboard
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const acceptedOrders = await Order.countDocuments({ status: 'accepted' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    res.json({
      total: totalOrders,
      pending: pendingOrders,
      accepted: acceptedOrders,
      completed: completedOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};