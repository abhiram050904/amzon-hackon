const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],

  // Order Type & Emissions
  orderType: { type: String, enum: ['normal', 'eco'], default: 'normal' },
  co2Reduced: { type: Number, default: 0 }, // CO₂ saved by eco options
  ecoCoinsEarned: { type: Number, default: 0 },

  // Group Order Fields
  isGroupOrder: { type: Boolean, default: false },
  groupOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupOrder', default: null },

  // Returns
  returnPackageSelected: { type: Boolean, default: false },

  // Status Tracking
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  deliveryStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
