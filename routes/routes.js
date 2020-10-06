const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user.ctrl');

router.post('/api/v1/auth/create-user', userCtrl.createUser);
router.post('/api/v1/auth/login-user', userCtrl.loginUser);

module.exports = router;