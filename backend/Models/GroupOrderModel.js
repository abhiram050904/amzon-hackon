const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who started the group order

  participants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    joinedAt: { type: Date, default: Date.now }
  }],

  discountPercent: { type: Number, default: 5 },


  groupOrderCode: { type: String, unique: true, required: true }, // invite/share code

  status: { type: String, enum: ['open', 'closed', 'completed','readyForPayment'], default: 'open' },

  items: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAddition: { type: Number, required: true },
    returnPackage: {type: Boolean,default: false},
    addedAt: { type: Date, default: Date.now }
  }],

  returnPackage: {type: Boolean,default: false},
  packagingType: { type: String, enum: ['eco', 'gift', 'standard'], default: 'eco' },
  totalAmount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Optional: update updatedAt on every save
groupOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
