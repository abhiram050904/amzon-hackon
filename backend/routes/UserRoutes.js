const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getUser,
  redeemEcoCoins,
  updateUser
} = require('../controllers/UserController');
const upload = require('../middlewares/multer');
const authUser = require('../middlewares/authUser');

// Public
router.post('/register', upload.single('profileImage'), createUser);
router.post('/login', loginUser);

// Protected
router.get('/', authUser, getUser);
router.put('/update', authUser, upload.single('profileImage'), updateUser);
router.post('/redeem', authUser, redeemEcoCoins);

module.exports = router;
