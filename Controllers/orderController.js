const OrderModel = require('../Models/Order');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const order = new OrderModel({
      user: req.user._id,
      items,
      total,
      shippingAddress,
      paymentMethod
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message || error.toString() });
  }
};

// Récupérer toutes les commandes (admin)
// Dans orderController.js
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching orders', 
      error: error.message || error.toString() 
    });
  }
};

// Récupérer les commandes de l'utilisateur connecté
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id })
      .populate('items.product', 'name price');
    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes utilisateur:', error);
    res.status(500).json({ message: 'Error fetching user orders', error: error.message || error.toString() });
  }
};

// Mettre à jour le statut d'une commande (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message || error.toString() });
  }
};
