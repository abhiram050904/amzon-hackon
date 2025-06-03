const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  brand:String,
  soldBy:String,
  category: { type: String, required: true },
  co2Emission: Number, // grams/kg
  ecoRating: { type: Number, min: 1, max: 5 },
  normalRating: { type: Number, min: 1, max: 5 },
  ecoModesAvailable: Boolean,

  ecoImpact: {
    madeFrom: String,
    isRecyclable: Boolean,
    isBiodegradable: Boolean
  },

  images: [{ type: String }],  // Array of Cloudinary URLs for product images

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);