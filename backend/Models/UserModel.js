const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  ecoCoins: { type: Number, default: 0 },

  profileImage: { type: String, default: '' },  // Cloudinary URL or empty string

  co2SavedLogs: [{
    date: { type: Date, default: Date.now },
    amount: Number,
    reason: { type: String, enum: ['group_order', 'return_package', 'eco_purchase'] }
  }],

  ecoIncentives: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['group_order', 'return_package', 'eco_purchase'] },
    ecoCoinsEarned: Number
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
