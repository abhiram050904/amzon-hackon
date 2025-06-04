const Order = require('../Models/OrderModel');
const Product = require('../Models/ProductModel');
const User = require('../Models/UserModel');
const dotenv=require('dotenv')
dotenv.config()
const Razorpay = require('razorpay');
const crypto = require('crypto');



const handleIndividualOrderBeforePayment = async (req, res) => {
  try {
    const {
      items,
      packagingType,
      returnPackage,
      shippingAddress,
      discountPercent,
      discountReason
    } = req.body;

    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const productIds = items.map(item => item.productId);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = productsFromDB.find(p => p._id.toString() === item.productId);
      if (!product) continue;

      const price = product.price;
      const quantity = item.quantity;

      orderItems.push({
        productId: product._id,
        quantity,
        packagingType,
        priceAtPurchase: price,
        addedBy: userId
      });

      totalAmount += quantity * price;
    }

    const discountedAmount = totalAmount - (totalAmount * discountPercent / 100);

    const newOrder = new Order({
      userId: userId,
      products: orderItems,
      packagingType,
      returnPackage,
      shippingAddress,
      isGroupOrder: false,
      discountPercent,
      discountReason,
      totalAmount: discountedAmount,
      originalAmount: totalAmount,
      paymentStatus: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order saved. Proceed to payment',
      order: newOrder
    });
  } catch (err) {
    console.error('Error handling individual order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const handleGroupOrderBeforePayment = async (req, res) => {
  try {
    const { groupOrder, shippingAddress } = req.body;
    const userId=req.user.id;


    if (!groupOrder || !Array.isArray(groupOrder.items) || groupOrder.items.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty group order data' });
    }

    if(!shippingAddress){
      return res.status(400).json({ message: 'Invalid or empty address' });
    }

    const productIds = groupOrder.items.map(item => item.productId);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of groupOrder.items) {
      const product = productsFromDB.find(p => p._id.toString() === item.productId.toString());
      if (!product) {
        console.warn('Product not found for item:', item.productId);
        continue;
      }

      const quantity = item.quantity || 1;
      const price =
  typeof item.priceAtAddition === 'number' && item.priceAtAddition > 0
    ? item.priceAtAddition
    : (product.price || 0);

      totalAmount += quantity * price;

      orderItems.push({
        productId: product._id,
        quantity,
        packagingType: groupOrder.packagingType,
        priceAtPurchase: price,
        addedBy: item.userId,
      });
    }

    const discountPercent = groupOrder.discountPercent || 0;
    const discountedAmount = totalAmount - (totalAmount * discountPercent / 100);


    const newOrder = new Order({
      userId: userId,
      isGroupOrder: true,
      groupOrderId: groupOrder._id,
      products: orderItems,
      packagingType: groupOrder.packagingType,
      returnPackage: groupOrder.returnPackage,
      shippingAddress,
      isGroupOrder: false,
      discountPercent,
      discountReason: 'Group Order Discount',
      totalAmount: Number(discountedAmount.toFixed(2)),
      originalAmount: Number(totalAmount.toFixed(2)),
      paymentStatus: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order saved. Proceed to payment',
      order: newOrder
    });
      
  } catch (err) {
    console.error('Error in handleGroupOrderBeforePayment:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay configuration. Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET in .env');
}


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRETs
});



// // 1. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100, // convert to paisa
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    });

    res.status(200).json({ order: razorpayOrder });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
};

// // 2. Verify Razorpay Payment & Create Order
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails // includes everything required to create order
    } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Razorpay signature' });
    }

    // If valid, create paid order
    req.body = {
      ...orderDetails,
      paymentInfo: {
        provider: 'razorpay',
        transactionId: razorpay_payment_id
      }
    };

    await createOrderAfterPayment(req, res);
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// // 3. Create COD Order directly (fallback)
const createCODOrder = async (req, res) => {
  try {
    const orderDetails = req.body;

    req.body = {
      ...orderDetails,
      paymentInfo: {
        provider: 'cod',
        transactionId: `COD-${Date.now()}`
      }
    };

    await createOrderAfterPayment(req, res);
  } catch (err) {
    console.error('COD order creation failed:', err);
    res.status(500).json({ message: 'COD order failed' });
  }
};


// // 2. Create order after successful payment
// const createOrderAfterPayment = async (req, res) => {
//   try {
//     const {
//       userId,
//       isGroupOrder,
//       groupOrderId,
//       products,
//       packagingType,
//       returnPackage,
//       totalAmount,
//       discountPercent,
//       discountReason,
//       paymentInfo,
//       shippingAddress
//     } = req.body;

//     let ecoCoinsEarned = 0;
//     let co2Reduced = 0;
//     const ecoIncentives = [];
//     const co2SavedLogs = [];

//     const dateNow = new Date();

//     if (packagingType === 'eco') {
//       const coins = products.reduce((sum, p) => sum + p.quantity * 10, 0);
//       const co2 = products.reduce((sum, p) => sum + p.quantity * 5, 0);
//       ecoCoinsEarned += coins;
//       co2Reduced += co2;
//       ecoIncentives.push({ date: dateNow, type: 'eco_purchase', ecoCoinsEarned: coins });
//       co2SavedLogs.push({ date: dateNow, amount: co2, reason: 'eco_purchase' });
//     }

//     if (returnPackage) {
//       const coins = products.reduce((sum, p) => sum + p.quantity * 10, 0);
//       ecoCoinsEarned += coins;
//       ecoIncentives.push({ date: dateNow, type: 'return_package', ecoCoinsEarned: coins });
//       co2SavedLogs.push({ date: dateNow, amount: 0, reason: 'return_package' }); // Optional: define CO2 savings if needed
//     }

//     const order = new Order({
//       userId,
//       isGroupOrder,
//       groupOrderId: isGroupOrder ? groupOrderId : null,
//       products,
//       packagingType,
//       returnPackage,
//       totalAmount,
//       discountPercent,
//       discountReason,
//       paymentInfo: {
//         provider: paymentInfo.provider,
//         transactionId: paymentInfo.transactionId,
//         paidAt: dateNow
//       },
//       paymentStatus: 'paid',
//       deliveryStatus: 'processing',
//       orderType: packagingType === 'eco' ? 'eco' : 'normal',
//       shippingAddress,
//       ecoCoinsEarned,
//       co2Reduced,
//       expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
//     });

//     await order.save();

//     const ecoDataMap = {};
//     for (const p of products) {
//       if (!ecoDataMap[p.addedBy]) ecoDataMap[p.addedBy] = { ecoCoins: 0, co2: 0, returnEcoCoins: 0 };
//       if (packagingType === 'eco') {
//         ecoDataMap[p.addedBy].ecoCoins += p.quantity * 10;
//         ecoDataMap[p.addedBy].co2 += p.quantity * 5;
//       }
//       if (returnPackage) {
//         ecoDataMap[p.addedBy].returnEcoCoins += p.quantity * 10;
//       }
//     }

//     for (const userId in ecoDataMap) {
//       const ecoCoinsEarned = ecoDataMap[userId].ecoCoins + ecoDataMap[userId].returnEcoCoins;
//       const co2Reduced = ecoDataMap[userId].co2;
//       const ecoIncentives = [];
//       const co2SavedLogs = [];

//       if (ecoDataMap[userId].ecoCoins > 0) {
//         ecoIncentives.push({ date: dateNow, type: 'eco_purchase', ecoCoinsEarned: ecoDataMap[userId].ecoCoins });
//         co2SavedLogs.push({ date: dateNow, amount: co2Reduced, reason: 'eco_purchase' });
//       }
//       if (ecoDataMap[userId].returnEcoCoins > 0) {
//         ecoIncentives.push({ date: dateNow, type: 'return_package', ecoCoinsEarned: ecoDataMap[userId].returnEcoCoins });
//       }

//       await User.findByIdAndUpdate(userId, {
//         $inc: { ecoCoins: ecoCoinsEarned },
//         $push: {
//           orders: order._id,
//           ecoIncentives: { $each: ecoIncentives },
//           co2SavedLogs: { $each: co2SavedLogs }
//         }
//       });
//     }

//     res.status(201).json({ message: 'Order created successfully', order });
//   } catch (err) {
//     console.error('Error creating order after payment:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // 3. Get logged-in user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// // 4. Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    const userId=req.user.id;

    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// // 5. Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Admin order fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus: status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Delivery status updated', order });
  } catch (err) {
    console.error('Error updating delivery status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow cancel if not shipped, unless admin
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this order' });
    }

    if (['shipped', 'out_for_delivery', 'delivered'].includes(order.deliveryStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled after shipment' });
    }

    order.deliveryStatus = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refund_initiated' : 'cancelled';

    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  handleIndividualOrderBeforePayment,
  handleGroupOrderBeforePayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateDeliveryStatus,
  cancelOrder
  // createOrderAfterPament,
  // createRazorpayOrder,
  // verifyRazorpayPayment,
  // createCODOrder,

};
