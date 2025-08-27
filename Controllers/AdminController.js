const Product = require('../models/Product');
const Order = require('../Models/Order');
const UserModel = require('../Models/User');
// const Category = require('../Models/Category'); // Si tu as un modèle catégorie

// Categories (si tu gères)
const getAllCategories = async (req, res) => {
    try {
        // Exemple si tu as un modèle Category
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// Créer un produit
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imgUrl, colors, sizes } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imgUrl,
            colors,
            sizes
        });
        await product.save();
        res.status(201).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// Modifier un produit
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, imgUrl, colors, sizes } = req.body;
        
        const product = await Product.findByIdAndUpdate(id, {
            name,
            description,
            price,
            category,
            stock,
            imgUrl,
            colors,
            sizes,
            updatedAt: new Date()
        }, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

// Tes fonctions pour commandes (à garder)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const order = await Order.findByIdAndUpdate(id, {
            status,
            updatedAt: new Date()
        }, { new: true });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

module.exports = {
    // createCategory, // à supprimer ou à implémenter
    getAllCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus
};
