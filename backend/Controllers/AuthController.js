const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: "User already exists, you can login", success: false });
        }
        
        const userModel = new UserModel({ name, email, password, role: role || 'user' });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        
        res.status(201).json({
            message: "Signup successfully",
            success: true,
            user: {
                id: userModel._id,
                name: userModel.name,
                email: userModel.email,
                role: userModel.role
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed - user not found"
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed - invalid credentials"
            });
        }

        const token = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password');
        res.status(200).json({
            success: true,
            users
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
    signup,
    login,
    getAllUsers
};