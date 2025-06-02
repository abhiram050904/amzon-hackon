const GroupOrder = require('../Models/GroupOrderModel');

const createGroupOrder = async (req, res) => {
  try {
    const { initiatorUserId, products, deliveryAddress, paymentMethod } = req.body;

    if (!initiatorUserId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'initiatorUserId and products array are required' });
    }

    const groupOrder = new GroupOrder({
      initiatorUserId,
      products,
      deliveryAddress,
      paymentMethod,
      participants: [initiatorUserId],
      status: 'pending',
      createdAt: new Date()
    });

    await groupOrder.save();

    return res.status(201).json({ message: 'Group order created', groupOrderId: groupOrder._id });
  } catch (err) {
    console.error('Error creating group order:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getGroupOrder = async (req, res) => {
  try {
    const groupOrderId = req.params.id;

    if (!groupOrderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid group order ID format' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId).populate('products.productId');
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    return res.json(groupOrder);
  } catch (err) {
    console.error('Error fetching group order:', err);
    return res.status(500).json({ error: err.message });
  }
};

const listGroupOrders = async (req, res) => {
  try {
    const groupOrders = await GroupOrder.find().populate('products.productId');
    return res.json(groupOrders);
  } catch (err) {
    console.error('Error listing group orders:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroupOrder,
  getGroupOrder,
  listGroupOrders
};
