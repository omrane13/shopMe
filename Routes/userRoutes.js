const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adaptez le chemin selon votre structure
const ensureAuthenticated = require('../Middleware/Auth'); // Votre middleware existant
const isAdmin = require('../Middleware/isAdmin'); // À créer

// GET tous les utilisateurs (admin seulement)
router.get('/', [ensureAuthenticated, isAdmin], async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclut les mots de passe
        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});

// PUT changer le rôle d'un utilisateur (admin seulement)
router.put('/:id/role', [ensureAuthenticated, isAdmin], async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});

// PUT mettre à jour un utilisateur (admin seulement)
router.put('/:id', [ensureAuthenticated, isAdmin], async (req, res) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});
// Dans userRoutes.js (temporairement)
router.post('/create-admin', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role: 'admin' 
    });
    await adminUser.save();
    res.status(201).json({ success: true });
});

module.exports = router;