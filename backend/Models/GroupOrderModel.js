const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who started the group order

  participants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    joinedAt: { type: Date, default: Date.now }
  }],

  discountPercent: { type: Number, default: 10 }, // e.g., 10% discount on package or total order

  minParticipants: { type: Number, default: 2 },  // minimum users needed to activate discount

  groupOrderCode: { type: String, unique: true, required: true }, // invite/share code

  status: { type: String, enum: ['open', 'closed', 'completed'], default: 'open' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Optional: update updatedAt on every save
groupOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
