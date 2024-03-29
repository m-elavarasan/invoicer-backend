const Channel = require('../models/channel');

const getChannels = async (req, res) => {
    try {
        const channels = await Channel.find();
        res.json(channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getChannelById = async (req, res) => {
    const { id } = req.params;

    try {
        const channel = await Channel.findById(id);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        res.json(channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createChannel = async (req, res) => {
    const { name, description, channelId } = req.body;
    const createdBy = req.user.userId;

    try {
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Channel name is required" });
        }
        if (!description || description.trim().length === 0) {
            return res.status(400).json({ message: "Channel description is required" });
        }
        const existingChannel = await Channel.findOne({ name });
        if (existingChannel) {
            return res.status(400).json({ message: "Channel with this name already exists" });
        }
        const newChannel = new Channel({ name, description, createdBy, channelId });

        await newChannel.save();

        res.status(201).json(newChannel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getChannels,
    getChannelById,
    createChannel
};
