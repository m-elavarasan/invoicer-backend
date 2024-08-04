const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, userController.getUsers);

router.get('/getUserById/:userId', verifyToken, userController.getUserByUserId);

router.post('/create', userController.createUser);

module.exports = router;
