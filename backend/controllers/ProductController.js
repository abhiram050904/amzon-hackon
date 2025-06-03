
const Product=require('../Models/ProductModel')
const cloudinary=require('../config/CloudinaryConfig')

const uploadImagesToCloudinary = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'image'
    });
    urls.push(result.secure_url);
  }
  return urls;
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      brand,
      soldBy,
      category,
      co2Emission,
      normalRating,
      ecoRating,
      ecoModesAvailable,
      ecoImpact
    } = req.body;

    // You might want to add validation for required fields here

     let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadImagesToCloudinary(req.files, 'product_images');
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      brand,
      soldBy,
      category,
      co2Emission,
      normalRating,
      ecoRating,
      ecoModesAvailable,
      ecoImpact,
      images
    });

    await product.save();

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: err.message });
  }
};


const getProducts = async (req, res) => {
  try {
    const { category, minEcoRating, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minEcoRating) filter.ecoRating = { $gte: Number(minEcoRating) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const {
      name,
      description,
      price,
      stock,
      brand,
      soldBy,
      category,
      co2Emission,
      normalRating,
      ecoRating,
      ecoModesAvailable,
      ecoImpact
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update only fields provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (brand !== undefined) product.brand = brand;
    if (soldBy !== undefined) product.soldBy = soldBy;
    if (category !== undefined) product.category = category;
    if (co2Emission !== undefined) product.co2Emission = co2Emission;
    if (ecoRating !== undefined) product.ecoRating = ecoRating;
    if (ecoModesAvailable !== undefined) product.ecoModesAvailable = ecoModesAvailable;
    if (ecoImpact !== undefined) product.ecoImpact = ecoImpact;
    if (normalRating !== undefined) product.normalRating = normalRating;

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      const newImages = await uploadImagesToCloudinary(req.files, 'product_images');
      product.images = product.images.concat(newImages);
    }

    await product.save();

    return res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: err.message });
  }
};



const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const products = await Product.find({ category });

    return res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct
};
