// Routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

// GET all products
router.get('/', productController.getAllProducts);

// GET products by category
router.get('/category/:categoryName', productController.getProductsByCategory);
// GET product by ID
router.get('/:productId', productController.getProductById);

module.exports = router;