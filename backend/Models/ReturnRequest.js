const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  status: { type: String, enum: ['pending', 'scheduled', 'collected'], default: 'pending' },
  scheduledDate: Date
});

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
