const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');

const {
  getProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} = require('../controllers/ProductController');

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Accept multiple images with 'images' key in form-data
router.post('/create', upload.array('images', 5), createProduct);
router.put('/update/:id', upload.array('images', 5), updateProduct);

router.delete('/delete/:id', deleteProduct);

module.exports = router;
