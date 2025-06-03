const express = require('express');
const router = express.Router();
const {
  addToCart,
  updateCartItemQuantity,
  updateReturnPackageFlag,
  removeItemFromCart,
  clearCart,
  getCart
} = require('../controllers/CartController');
const authUser = require('../middlewares/authUser');


router.get('/',authUser, getCart);

router.post('/add',authUser,addToCart);

router.put('/update/quantity', authUser,updateCartItemQuantity);

router.put('/update/return-package',authUser, updateReturnPackageFlag);

router.delete('/remove',authUser, removeItemFromCart);

router.delete('/clear',authUser, clearCart);

module.exports = router;
