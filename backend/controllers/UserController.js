const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/CloudinaryConfig');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file?.path || '';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }



    let profileImageUrl = '';
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        resource_type: 'image'
      });
      profileImageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage:profileImageUrl,
      ecoCoins: 0,
      co2SavedLogs: []
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        ecoCoins: user.ecoCoins
      },
      token
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        ecoCoins: user.ecoCoins
      },
      token
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get Authenticated User
const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Redeem ecoCoins
const redeemEcoCoins = async (req, res) => {
  try {
    const userId = req.user.id;
    const { coinsToRedeem, description } = req.body;

    if (typeof coinsToRedeem !== 'number' || coinsToRedeem <= 0) {
      return res.status(400).json({ message: 'Valid coinsToRedeem is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.ecoCoins < coinsToRedeem) {
      return res.status(400).json({ message: 'Insufficient ecoCoins to redeem' });
    }

    user.ecoCoins -= coinsToRedeem;

    user.ecoRedemptions = user.ecoRedemptions || [];
    user.ecoRedemptions.push({
      coinsRedeemed: coinsToRedeem,
      description: description || 'Redeemed ecoCoins'
    });

    await user.save();

    return res.status(200).json({ 
      message: 'ecoCoins redeemed successfully',
      remainingEcoCoins: user.ecoCoins
    });

  } catch (err) {
    console.error('Error redeeming ecoCoins:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update User Profile
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      password,
      ecoCoins,
      co2SavedLogs,
      ecoIncentives
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    if (typeof ecoCoins === 'number') user.ecoCoins = ecoCoins;

    // If arrays are provided, replace them
    if (co2SavedLogs && Array.isArray(co2SavedLogs)) {
      user.co2SavedLogs = co2SavedLogs;
    }

    if (ecoIncentives && Array.isArray(ecoIncentives)) {
      user.ecoIncentives = ecoIncentives;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        resource_type: 'image'
      });
      user.profileImage = result.secure_url;
    }

    await user.save();

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  getUser,
  redeemEcoCoins,
  updateUser
};
