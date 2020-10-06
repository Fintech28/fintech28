const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user.ctrl');
const adminCtrl = require('../controllers/admin.ctrl');
const authUser = require('../controllers/authUser');

// user sign up and login
router.post('/api/v1/auth/create-user', userCtrl.createUser); // sign up
router.post('/api/v1/auth/login-user', userCtrl.loginUser); // log in

// admin verify user
router.patch('/api/v1/admin/verify-user/userId=:userId', adminCtrl.verifyUser);
// admin see all users
router.get('/api/v1/admin/users', adminCtrl.seeAllUsers);
// admin see single users
router.get('/api/v1/admin/users/userId=:userId', adminCtrl.seeSingleUser);

// user check balance
router.get('/api/v1/check-balance', authUser.authUserFn, userCtrl.checkBalance);

module.exports = router;