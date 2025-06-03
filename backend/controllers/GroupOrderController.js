const GroupOrder = require('../Models/GroupOrderModel');
const Product=require('../Models/ProductModel')
const Order=require('../Models/OrderModel')

const generateGroupOrderCode = () => {
  return uuidv4().split('-')[0].toUpperCase();
};


const createGroupOrder = async (req, res) => {
  try {
    const initiator = req.user.id;

    let groupOrderCode;
    let exists = true;
    while (exists) {
      groupOrderCode = generateGroupOrderCode();
      const existing = await GroupOrder.findOne({ groupOrderCode });
      if (!existing) exists = false;
    }

    const groupOrder = new GroupOrder({
      initiator,
      participants: [{ userId: initiator }],
      groupOrderCode,
      status: 'open',
      discountPercent: 10,
    });

    await groupOrder.save();

    res.status(201).json({ message: 'Group order created', groupOrder });
  } catch (err) {
    console.error('Create GroupOrder error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const joinGroupOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupOrderId } = req.body;

    if (!groupOrderId) {
      return res.status(400).json({ message: 'groupOrderId is required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);

    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    // Check if user already joined
    const alreadyJoined = groupOrder.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'User already in the group order' });
    }

    // Add user to participants
    groupOrder.participants.push({ userId, joinedAt: new Date() });
    await groupOrder.save();

    res.status(200).json({ message: 'Joined group order successfully', groupOrder });
  } catch (err) {
    console.error('Join group order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const getGroupOrderById = async (req, res) => {
  try {
    const { groupOrderId } = req.params;

    if (!groupOrderId) {
      return res.status(400).json({ message: 'groupOrderId is required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId)

    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    res.status(200).json(groupOrder);
  } catch (err) {
    console.error('Error fetching group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const listGroupOrders = async (req, res) => {
  try {
    const groupOrders = await GroupOrder.find()


    return res.json(groupOrders);
  } catch (err) {
    console.error('Error listing group orders:', err);
    return res.status(500).json({ error: err.message });
  }
};


const listActiveGroupOrdersForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: 'userId param is required' });
    }

    // Find group orders where user is initiator or participant and status not 'completed'
    const groupOrders = await GroupOrder.find({
      status: { $in: ['open', 'closed'] },
      $or: [
        { initiator: userId },
        { 'participants.userId': userId }
      ]
    })
      .sort({ updatedAt: -1 });

    res.status(200).json(groupOrders);
  } catch (err) {
    console.error('Error listing active group orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



const leaveGroupOrder = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const userId = req.user.id; // assuming auth middleware sets req.user

    if (!groupOrderId) {
      return res.status(400).json({ message: 'groupOrderId param is required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    // Check if user is participant
    const participantIndex = groupOrder.participants.findIndex(
      p => p.userId.toString() === userId.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: 'User is not a participant in this group order' });
    }

    // Remove participant
    groupOrder.participants.splice(participantIndex, 1);

    await groupOrder.save();

    // Optional: Also delete user's orders linked to this groupOrderId? Depends on business logic.

    res.status(200).json({ message: 'Left group order successfully', groupOrder });
  } catch (err) {
    console.error('Error leaving group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const deleteGroupOrder = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const userId = req.user._id; // assuming auth middleware sets req.user

    if (!groupOrderId) {
      return res.status(400).json({ message: 'groupOrderId param is required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    if (groupOrder.initiator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the initiator can delete the group order' });
    }

    if (groupOrder.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete a completed group order' });
    }

    await GroupOrder.findByIdAndDelete(groupOrderId);

    res.status(200).json({ message: 'Group order deleted successfully' });
  } catch (err) {
    console.error('Error deleting group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const addItemsToGroupOrder = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const userId = req.user.id;
    const {selectedItems} = req.body;

    if (!groupOrderId) {
      return res.status(400).json({ message: 'groupOrderId param is required' });
    }

    if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);

    if (!groupOrder || groupOrder.status !== 'open') {
      return res.status(400).json({ message: 'Group order not found or not open' });
    }

    const isParticipant = groupOrder.participants.some(p => p.userId.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'User is not a participant of this group order' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }


    // Fetch product prices
    const productIds = selectedItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });


     const productMap = new Map();
     products.forEach(prod => productMap.set(prod._id.toString(), prod.price));


     const groupOrderItems = selectedItems.map(item => ({
      userId,
      productId: item.productId,
      quantity: item.quantity,
      returnPackage: item.returnPackage || false,
      priceAtAddition: productMap.get(item.productId) || 0
    }));


     groupOrder.items.push(...groupOrderItems);


     selectedItems.forEach(selected => {
      const index = cart.items.findIndex(
        cartItem =>
          cartItem.productId.toString() === selected.productId &&
          cartItem.returnPackage === selected.returnPackage
      );
      if (index !== -1) {
        cart.items.splice(index, 1);
      }
    });


    await groupOrder.save();
    await cart.save();

    res.status(200).json({ message: 'Items added to group order', groupOrder });
  } catch (err) {
    console.error('Error adding items to group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



const removeItemsFromGroupOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    const { selectedItems } = req.body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: 'Selected items are required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    // Remove only the matching items added by the same user
    groupOrder.items = groupOrder.items.filter(groupItem => {
      const match = selectedItems.some(sel =>
        groupItem.userId.toString() === userId &&
        groupItem.productId.toString() === sel.productId &&
        groupItem.returnPackage === (sel.returnPackage || false)
      );
      return !match; // keep only non-matching items
    });

    await groupOrder.save();

    res.status(200).json({ message: 'Selected items removed from group order' });

  } catch (err) {
    console.error('Error removing items from group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const updateGroupOrderItemQuantity = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const { productId, userId, returnPackage = false, newQuantity } = req.body;

    if (!productId || !userId || !newQuantity || newQuantity < 1) {
      return res.status(400).json({ message: 'Valid productId, userId, and newQuantity are required' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    const item = groupOrder.items.find(
      (i) =>
        i.userId.toString() === userId &&
        i.productId.toString() === productId &&
        i.returnPackage === returnPackage
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in group order' });
    }

    item.quantity = newQuantity;
    await groupOrder.save();

    res.status(200).json({ message: 'Item quantity updated successfully', item });
  } catch (err) {
    console.error('Error updating item quantity in group order:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



const setPackagingType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    const { packagingType } = req.body;

    const allowedTypes = ['eco-friendly', 'gift-wrapped', 'standard'];
    if (!allowedTypes.includes(packagingType)) {
      return res.status(400).json({ message: 'Invalid packaging type' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    if (groupOrder.initiator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the initiator can set packaging type' });
    }

    groupOrder.packagingType = packagingType;
    await groupOrder.save();

    return res.status(200).json({
      message: 'Packaging type updated successfully',
      packagingType: groupOrder.packagingType
    });

  } catch (err) {
    console.error('Error setting packaging type:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};



const setGroupOrderPackagingType = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const { packagingType } = req.body;

    // Validate packagingType
    const allowedPackagingTypes = ['eco', 'gift', 'standard'];
    if (!allowedPackagingTypes.includes(packagingType)) {
      return res.status(400).json({ message: 'Invalid packaging type' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    if (groupOrder.status !== 'open') {
      return res.status(400).json({ message: 'Cannot change packaging type for closed or completed group orders' });
    }

    groupOrder.packagingType = packagingType; // You will need to add packagingType field in GroupOrder model

    await groupOrder.save();

    res.status(200).json({ message: 'Packaging type set successfully', packagingType });
  } catch (err) {
    console.error('Error setting packaging type:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const finalizeGroupOrder = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const { packagingType, returnPackage } = req.body;
    const initiatorId = req.user.id;

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    if (groupOrder.initiator.toString() !== initiatorId.toString()) {
      return res.status(403).json({ message: 'Only the initiator can finalize the group order' });
    }

    if (groupOrder.status !== 'closed') {
      return res.status(400).json({ message: 'Group order must be closed before finalizing' });
    }

    if (!groupOrder.items || groupOrder.items.length === 0) {
      return res.status(400).json({ message: 'Group order has no items to finalize' });
    }

    // Step 1: Aggregate item totals
    const productMap = new Map(); // productId -> { quantity, price }
    for (const item of groupOrder.items) {
      const pid = item.productId.toString();
      const existing = productMap.get(pid) || { quantity: 0, priceAtAddition: item.priceAtAddition };
      existing.quantity += item.quantity;
      productMap.set(pid, existing);
    }

    // Step 2: Calculate total price
    let totalAmount = 0;
    for (const { quantity, priceAtAddition } of productMap.values()) {
      totalAmount += quantity * priceAtAddition;
    }

    const discountPercent = groupOrder.discountPercent || 0;
    const discountedTotal = +(totalAmount * ((100 - discountPercent) / 100)).toFixed(2);

    // Step 3: Update group order with packing details and price
    groupOrder.packagingType = packagingType;
    groupOrder.returnPackage = !!returnPackage;
    groupOrder.totalAmount = discountedTotal; // ← add this to schema if not present
    groupOrder.status = 'readyForPayment'; // status to indicate it’s ready but not yet paid
    await groupOrder.save();

    // Step 4: Respond with all necessary details for payment screen
    res.status(200).json({
      message: 'Group order finalized. Proceed to payment.',
      groupOrderId,
      groupOrder,
      packagingType,
      returnPackage,
      totalAmount: discountedTotal,
      discountPercent,
      items: groupOrder.items
    });

  } catch (err) {
    console.error('Error finalizing group order:', err);
    res.status(500).json({ message: 'Server error while finalizing group order' });
  }
};


const updateGroupOrderDiscount = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const { discountPercent } = req.body;
    const userId = req.user._id;

    if (discountPercent == null || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ message: 'Invalid discountPercent value' });
    }

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) return res.status(404).json({ message: 'Group order not found' });

    if (groupOrder.initiator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the initiator can update the discount' });
    }

    groupOrder.discountPercent = discountPercent;
    await groupOrder.save();

    res.status(200).json({ message: 'Discount updated successfully', discountPercent });
  } catch (err) {
    console.error('Error updating discount:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  createGroupOrder,joinGroupOrder,getGroupOrderById,listGroupOrders,listActiveGroupOrdersForUser,leaveGroupOrder,deleteGroupOrder,
  addItemsToGroupOrder,removeItemsFromGroupOrder,updateGroupOrderItemQuantity,setPackagingType,setGroupOrderPackagingType,finalizeGroupOrder,updateGroupOrderDiscount
};
