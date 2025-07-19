const otpModel = require("../../models/otp/otpModel");
const sendSms = require("../../utils/smsService");

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP
exports.sendOtp = (req, res) => {
  const number = req.body.number || req.body.mobile;
  console.log(`[SEND OTP] Received OTP request for: ${number}`);

  otpModel.findUserByNumber(number, (error, results) => {
    if (error) {
      console.error("[SEND OTP] Database error:", error);
      return res.status(500).send("Database error");
    }

    if (!results.length) {
      console.log(`[SEND OTP] No user found with number: ${number}`);
      return res.status(404).send("This number is not registered");
    }

    const otp = generateOTP();
    console.log(`[SEND OTP] Generated OTP for ${number}: ${otp}`);

    otpModel.updateOtpByNumber(otp, number, async (err) => {
      if (err) {
        console.error("[SEND OTP] Error updating OTP:", err);
        return res.status(500).send("Error storing OTP");
      }

      try {
        await sendSms(number, otp); // use smsService here
        console.log(`[SEND OTP] SMS sent successfully to ${number}`);
        res.status(200).send("OTP sent successfully");
      } catch (smsErr) {
        console.error("[SEND OTP] SMS sending failed:", smsErr.message);
        res.status(500).send("Failed to send OTP");
      }
    });
  });
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const number = req.body.number || req.body.mobile;
  const otp = req.body.otp;
  console.log(`[VERIFY OTP] Verifying OTP for ${number}: ${otp}`);

  otpModel.verifyOtp(number, (err, users) => {
    if (err) {
      console.error("[VERIFY OTP] Database error:", err);
      return res.status(500).send("Database error");
    }

    const user = users.find((u) => u.otp == otp);
    if (!user) {
      console.log(`[VERIFY OTP] Invalid OTP for ${number}`);
      return res.status(400).send("Invalid OTP");
    }

    otpModel.updateOtpVerified(number, (updateErr) => {
      if (updateErr) {
        console.error("[VERIFY OTP] Failed to update verification status:", updateErr);
        return res.status(500).send("Failed to update verification status");
      }

      console.log(`[VERIFY OTP] OTP verified successfully for ${number}`);
      res.status(200).send("OTP verified successfully");
    });
  });
};

exports.changePassword = (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ success: false, message: "Mobile and password are required" });
  }

  // Fetch existing password first
  otpModel.getPasswordByMobile(mobile, (err, results) => {
    if (err) {
      console.error("[GET PASSWORD] Error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Mobile not found" });
    }

    const existingPassword = results[0].password;

    if (existingPassword === password) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as the old password" });
    }

    // Proceed with update
    otpModel.updatePasswordByMobile(mobile, password, (updateErr, updateResult) => {
      if (updateErr) {
        console.error("[CHANGE PASSWORD] Update error:", updateErr);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Mobile not found" });
      }

      res.status(200).json({ success: true, message: "Password updated successfully" });
    });
  });
};
