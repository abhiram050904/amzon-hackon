const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  returnPackage: {
    type: Boolean,
    default: false
  }
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
