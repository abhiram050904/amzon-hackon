const mongoose = require('mongoose');

const ecoCoinTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: { type: String, enum: ['eco_purchase', 'group_order', 'return_package'] },
  coins: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EcoCoinTransaction', ecoCoinTransactionSchema);
