const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');

router.post('/signup', adminController.post_signup);

router.post('/login', adminController.post_login);

module.exports = router;