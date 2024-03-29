// routes/channelRoutes.js

// Sample channel routes
const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, channelController.getChannels);
router.get('/:id', verifyToken, channelController.getChannelById);
router.post('/create', verifyToken, channelController.createChannel);

module.exports = router;
