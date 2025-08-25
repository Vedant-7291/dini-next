const mongoose = require('mongoose');

const upiSchema = new mongoose.Schema({
  upiId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UPI', upiSchema);