const express = require('express');
const router = express.Router();
const authenticationController = require('../../controllers/authentication/authenticationController');

// User routes
router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);

// Admin routes
router.post('/adminlogin', authenticationController.adminLogin);

// Staff routes
router.post('/stafflogin', authenticationController.staffLogin);

router.post("/api/change-password", authenticationController.changePassword);


module.exports = router;
