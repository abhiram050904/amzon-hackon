const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImage || '',   // Store Cloudinary URL if provided
      ecoCoins: 0,
      co2SavedLogs: []
    });

    await user.save();

    return res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {

    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }


    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ error: err.message });
  }
};


const redeemEcoCoins = async (req, res) => {
  try {
    const { userId, coinsToRedeem, description } = req.body;

    if (!userId || typeof coinsToRedeem !== 'number' || coinsToRedeem <= 0) {
      return res.status(400).json({ message: 'Valid userId and coinsToRedeem are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.ecoCoins < coinsToRedeem) {
      return res.status(400).json({ message: 'Insufficient ecoCoins to redeem' });
    }

    // Deduct ecoCoins
    user.ecoCoins -= coinsToRedeem;

    // Log redemption (optional)
    user.ecoRedemptions = user.ecoRedemptions || [];
    user.ecoRedemptions.push({
      coinsRedeemed: coinsToRedeem,
      description: description || 'Redeemed ecoCoins'
    });

    await user.save();

    // TODO: Apply discount or reward logic here, e.g., generate coupon, etc.

    return res.status(200).json({ 
      message: 'ecoCoins redeemed successfully',
      remainingEcoCoins: user.ecoCoins
    });

  } catch (err) {
    console.error('Error redeeming ecoCoins:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getUser,
  redeemEcoCoins
};
