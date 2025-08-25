// server/models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Main', 'Starter', 'Drink', 'Dessert', 'pizza', 'fries', 'burger', 'maggie', 'pasta', 'salad', 'sandwich']
  },
  image: { type: String, default: '/pngegg.png' },
  preparationTime: { type: Number, default: 10 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);