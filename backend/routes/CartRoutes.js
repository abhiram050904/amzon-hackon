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

//it will be userid
router.get('/:userId', getCart);


router.post('/add', addToCart);

router.put('/update/quantity', updateCartItemQuantity);

router.put('/update/return-package', updateReturnPackageFlag);

router.delete('/remove', removeItemFromCart);

router.delete('/clear/:userId', clearCart);

module.exports = router;
