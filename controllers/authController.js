// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({code:"NO_USER_FOUND", message: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ code:"WRONG_PASSWORD",message: "Invalid email or password" });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({
            code:"SUCCESS",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                lastLogin: user.lastLogin,
                channel: user.channel,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    loginUser,
    registerUser
};
