// controllers/productController.js
const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get products by category
// controllers/productController.js
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName}$`, "i") } // Case-insensitive
    });
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
