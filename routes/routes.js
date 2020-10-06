const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user.ctrl');
const adminCtrl = require('../controllers/admin.ctrl');

// user sign up and login
router.post('/api/v1/auth/create-user', userCtrl.createUser);
router.post('/api/v1/auth/login-user', userCtrl.loginUser);

// admin verify user
router.patch('/api/v1/admin/veify-user/userId=:userId', adminCtrl.verifyUser);

module.exports = router;