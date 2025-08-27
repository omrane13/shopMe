const router = require('express').Router();
const AdminController = require('../Controllers/AdminController');
const isAdmin = require('../Middleware/isAdmin');

// Commandes
router.get('/orders', isAdmin, AdminController.getAllOrders);
router.put('/orders/:id/status', isAdmin, AdminController.updateOrderStatus);

// Produits
router.post('/products', isAdmin, AdminController.createProduct);            // Create
router.put('/products/:id', isAdmin, AdminController.updateProduct);         // Update
router.delete('/products/:id', isAdmin, AdminController.deleteProduct);      // Delete

module.exports = router;
