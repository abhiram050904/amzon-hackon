const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  products: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    packagingType: {
      type: String,
      enum: ['eco', 'gift', 'standard'],
      default: 'standard'
    },
    priceAtPurchase: {
      type: Number,
      required: true
    }
  }],

  orderType: { 
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
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered'], 
    default: 'processing' 
  },

  totalAmount: {
    type: Number,
    required: true
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});
