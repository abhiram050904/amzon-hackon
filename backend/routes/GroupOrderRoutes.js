const express = require('express');
const router = express.Router();
const {
  createGroupOrder,
  joinGroupOrder,
  leaveGroupOrder,
  addItemsToGroupOrder,
  removeItemsFromGroupOrder,
  setPackagingType,
  finalizeGroupOrder,
  getGroupOrderById,
  listActiveGroupOrdersForUser,
  deleteGroupOrder,
  updateGroupOrderItemQuantity,
  setGroupOrderPackagingType,
  updateGroupOrderDiscount,
} = require('../controllers/GroupOrderController');
const authUser = require('../middlewares/authUser');


// All routes below require auth
router.use(authUser);

// Core routes
router.post('/create', createGroupOrder);
router.get('/get-all-group-orders-of-user', listActiveGroupOrdersForUser);
router.get('/:groupOrderId', getGroupOrderById);

// Participation
router.post('/join/:groupOrderId', joinGroupOrder);
router.post('/leave/:groupOrderId', leaveGroupOrder);
router.post('/delete/:groupOrderId', deleteGroupOrder);

// Items
router.post('/:groupOrderId/items/add', addItemsToGroupOrder);
router.post('/:groupOrderId/items/remove', removeItemsFromGroupOrder);
router.put('/:groupOrderId/items/update-quantity',updateGroupOrderItemQuantity)

// Preferences
router.post('/:groupOrderId/packaging', setPackagingType);
router.post('/:groupOrderId/package-select', setGroupOrderPackagingType);

// Finalization
router.post('/:groupOrderId/finalize', finalizeGroupOrder);

router.post('/:groupOrderId/set-discount',updateGroupOrderDiscount)

module.exports = router;
