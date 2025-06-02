const Product = require('../Models/ProductModel');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      ecoRating,
      co2Emission,
      ecoModesAvailable,
      ecoImpact
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      ecoRating,
      co2Emission,
      ecoModesAvailable,
      ecoImpact
    });

    await product.save();

    return res.status(201).json({
      message: 'Product created successfully',
      productId: product._id
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: err.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.json(products);
  } catch (err) {
    console.error('Error listing products:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  listProducts
};
