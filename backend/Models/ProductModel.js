const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,

  co2Emission: Number, // grams/kg
  ecoRating: { type: Number, min: 1, max: 5 },
  ecoModesAvailable: Boolean,

  ecoImpact: {
    madeFrom: String,
    isRecyclable: Boolean,
    isBiodegradable: Boolean
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
