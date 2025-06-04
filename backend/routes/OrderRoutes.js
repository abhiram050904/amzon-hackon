const express = require('express');
const router = express.Router();
const {
  prepareIndividualOrder,
  createOrderAfterPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCODOrder,
  updateDeliveryStatus,
  cancelOrder,
  handleIndividualOrderBeforePayment,
  handleGroupOrderBeforePayment
} = require('../controllers/OrderController');

const authUser = require('../middlewares/authUser');


router.post('/create-individual-order',authUser,handleIndividualOrderBeforePayment)
router.post('/create-group-order',authUser,handleGroupOrderBeforePayment)

    // // Prepare order (before payment)
    // router.post('/prepare', authUser, prepareIndividualOrder);

    // // Create Razorpay order (get payment order id)
    // router.post('/razorpay/order', authUser, createRazorpayOrder);

    // // Verify Razorpay payment and create order
    // router.post('/razorpay/verify', authUser, verifyRazorpayPayment);

    // // Create COD order (fallback)
    // router.post('/cod', authUser, createCODOrder);

    // // Create order directly (generic, if needed)
    // router.post('/create', authUser, createOrderAfterPayment);

    // // Get logged-in user's orders
    // router.get('/myorders', authUser, getMyOrders);

    // // Get order by ID
    // router.get('/:orderId', authUser, getOrderById);

    // // Admin: Get all orders
    // router.get('/', authUser, getAllOrders);

    // // Update delivery status (admin or user)
    // router.patch('/:orderId/delivery-status', authUser, updateDeliveryStatus);

    // // Cancel order (user)
    // router.patch('/:orderId/cancel', authUser, cancelOrder);

module.exports = router;
