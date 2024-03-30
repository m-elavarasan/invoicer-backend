const User = require('../models/user');
const Channel = require('../models/channel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createUser = async (req, res) => {
    const { username, email, password, name, dob, currency, phone, channel, role } = req.body;

    // Check if  the user creating the new user is a SuperAdmin
    if (role !== 'SuperAdmin') {
        return res.status(403).json({ message: "You don't have permission to perform this action" });
    }

    try {
        // Validate username
        if (!username || username.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters long" });
        }

        // If the new user's role is 'Admin', ensure that the user creating it is a SuperAdmin
        if (role === 'Admin' && req.user.role !== 'SuperAdmin') {
            return res.status(403).json({ message: "Only a SuperAdmin can create an Admin" });
        }

        if (!/^[a-zA-Z0-9_]{4,}$/.test(username)) {
            return res.status(400).json({ message: "Username must contain only letters, numbers, and underscores" });
        }
        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Validate email
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Validate channel
        if (!channel) {
            return res.status(400).json({ message: "Channel is required" });
        }

        // Check if the channel exists
        const existingChannel = await Channel.findOne({ channelId: channel });

        if (!existingChannel) {
            return res.status(400).json({ message: "Channel not found" });
        }

        // Validate password
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            name,
            dob,
            currency,
            phone,
            role,
            channel: existingChannel
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the new user and token
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


module.exports = {
    getUsers,
    getUserByUsername,
    createUser
};
