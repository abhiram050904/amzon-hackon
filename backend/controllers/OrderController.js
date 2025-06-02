const Order = require('../Models/OrderModel');
const User = require('../Models/UserModel');

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      orderType = 'normal',
      isGroupOrder = false,
      groupOrderId = null,
      returnPackageSelected = false
    } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'User ID and products are required' });
    }

    // Basic validation on products
    for (const item of products) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: 'Each product must have a valid productId and quantity >= 1' });
      }
    }

    // Calculate total CO2 reduced & eco coins (logic could be expanded later)
    let co2Reduced = 0;
    let ecoCoinsEarned = 0;
    if (orderType === 'eco') {
      // For example: 10 ecoCoins and 5kg CO2 reduced per product quantity, customize as needed
      ecoCoinsEarned = products.reduce((sum, p) => sum + p.quantity * 10, 0);
      co2Reduced = products.reduce((sum, p) => sum + p.quantity * 5, 0);
    }

    const order = new Order({
      userId,
      products,
      orderType,
      co2Reduced,
      ecoCoinsEarned,
      isGroupOrder,
      groupOrderId,
      returnPackageSelected,
      paymentStatus: 'pending',
      deliveryStatus: 'processing'
    });

    await order.save();

    // Update user: add order id, increment ecoCoins, append co2SavedLogs
    await User.findByIdAndUpdate(userId, {
      $inc: { ecoCoins: ecoCoinsEarned },
      $push: { 
        co2SavedLogs: { amount: co2Reduced, date: new Date() },
        orders: order._id
      }
    });

    return res.status(201).json({ message: 'Order created successfully', orderId: order._id });

  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')          
      .populate('products.productId', 'name price ecoRating'); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);

  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ error: err.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price ecoRating')
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (err) {
    console.error('Error listing orders:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update order payment status or delivery status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus, deliveryStatus } = req.body;

    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const updateData = {};
    if (paymentStatus) {
      if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status value' });
      }
      updateData.paymentStatus = paymentStatus;
    }

    if (deliveryStatus) {
      if (!['processing', 'shipped', 'delivered'].includes(deliveryStatus)) {
        return res.status(400).json({ message: 'Invalid delivery status value' });
      }
      updateData.deliveryStatus = deliveryStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid status fields provided for update' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order status updated', order: updatedOrder });

  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus
};
