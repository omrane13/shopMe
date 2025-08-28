const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../Middleware/Auth');
const isAdmin = require('../Middleware/isAdmin');
const orderController = require('../Controllers/orderController');

// Créer une commande (utilisateur connecté)
router.post('/', ensureAuthenticated, orderController.createOrder);

// Récupérer commandes de l'utilisateur connecté
router.get('/myorders', ensureAuthenticated, orderController.getUserOrders);

// Récupérer toutes les commandes (admin uniquement)
router.get('/', ensureAuthenticated, isAdmin, orderController.getAllOrders);

// Mettre à jour le statut d'une commande (admin)
router.put('/:orderId/status', ensureAuthenticated, isAdmin, orderController.updateOrderStatus);

module.exports = router;
