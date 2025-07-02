const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/otp/otpController");

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/change-password", otpController.changePassword);

module.exports = router;
