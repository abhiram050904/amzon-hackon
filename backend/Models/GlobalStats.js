const mongoose = require('mongoose');

const globalStatsSchema = new mongoose.Schema({
  totalCO2Saved: { type: Number, default: 0 },
  totalEcoCoinsGiven: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalStats', globalStatsSchema);
