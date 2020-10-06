const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user.ctrl');

router.post('/api/v1/auth/create-user', userCtrl.createUser);

module.exports = router;