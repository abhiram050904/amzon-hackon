const Cart = require('../Models/CartItemModel');
const Product = require('../Models/ProductModel');
const User=require('../Models/UserModel')
// Add item to cart or increment quantity
const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'userId and productId are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, returnPackage: false }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1, returnPackage: false });
      }
    }

    await cart.save();
    return res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ error: err.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'userId, productId and valid quantity are required' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    return res.status(500).json({ error: err.message });
  }
};

const updateReturnPackageFlag = async (req, res) => {
  try {
    const { userId, productId, returnPackage } = req.body;

    if (!userId || !productId || typeof returnPackage !== 'boolean') {
      return res.status(400).json({ message: 'userId, productId and returnPackage (boolean) are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    const prevReturnPackage = cart.items[itemIndex].returnPackage || false;
    const quantity = cart.items[itemIndex].quantity || 1;

    cart.items[itemIndex].returnPackage = returnPackage;
    await cart.save();

    if (prevReturnPackage !== returnPackage) {
      const ecoCoinsPerProduct = 10;
      const ecoCoinsChange = returnPackage 
        ? ecoCoinsPerProduct * quantity 
        : -ecoCoinsPerProduct * quantity;

      const co2Change = returnPackage 
        ? 100 * quantity // example grams saved
        : -100 * quantity;

      await User.findByIdAndUpdate(userId, {
        $inc: { ecoCoins: ecoCoinsChange },
        $push: {
          ecoIncentives: {
            type: 'return_package',
            date: new Date(),
            ecoCoinsEarned: ecoCoinsChange
          },
          co2SavedLogs: {
            reason: 'return_package',
            date: new Date(),
            amount: co2Change
          }
        }
      });
    }

    return res.status(200).json({ message: 'Return package flag updated', cart });
  } catch (err) {
    console.error('Error updating return package flag:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Remove a product from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { userId, cartItemId } = req.body;

    if (!userId || !cartItemId) {
      return res.status(400).json({ message: 'userId and cartItemId are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const updatedItems = cart.items.filter(item => item._id.toString() !== cartItemId);

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cart.items = updatedItems;
    await cart.save();

    return res.status(200).json({ message: 'Cart item removed', cart });
  } catch (err) {
    console.error('Error removing cart item:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Clear all items from cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    console.error('Error clearing cart:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get user's cart with populated product info
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId param is required' });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price ecoRating');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  updateCartItemQuantity,
  updateReturnPackageFlag,
  removeItemFromCart,
  clearCart,
  getCart
};
