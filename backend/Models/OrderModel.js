const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

   products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      packagingType: String,
      priceAtPurchase: Number,
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],

    PackageType: { 
    type: String, 
    enum: ['normal', 'eco','standard'], 
    default: 'normal' 
  },

  co2Reduced: { 
    type: Number, 
    default: 0 
  },
  ecoCoinsEarned: { 
    type: Number, 
    default: 0 
  },

  isGroupOrder: { 
    type: Boolean, 
    default: false 
  },
  groupOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GroupOrder', 
    default: null 
  },

  returnPackage: { 
    type: Boolean, 
    default: false 
  },

  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed','refund_initiated','cancelled'], 
    default: 'pending' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered','cancelled'], 
    default: 'processing' 
  },

  totalAmount: {
    type: Number,
    required: true
  },

  shippingAddress: {
  fullName: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String
},

paymentInfo: {
  provider: { type: String, enum: ['stripe', 'razorpay', 'paypal', 'cod'] },
  transactionId: { type: String },
  paidAt: { type: Date }
},

expectedDeliveryDate: { type: Date },
deliveredAt: { type: Date },
discountPercent: { type: Number, default: 0 },
discountReason: { type: String },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
