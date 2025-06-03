const userModel = require('../../models/authentication/userModel');
const adminModel = require('../../models/authentication/adminModel');
const staffModel = require('../../models/authentication/staffModel');

exports.signup = (req, res) => {
  const { username, email, password, contactNumber } = req.body;

  if (!username || !email || !password || !contactNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  userModel.checkExistingUser(email, username, contactNumber, (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });

    if (results.length > 0) {
      if (results.some(user => user.email === email)) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (results.some(user => user.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
      }
      if (results.some(user => user.contact_number === contactNumber)) {
        return res.status(400).json({ error: "Contact number already exists" });
      }
    }

    userModel.generateUserId((err, userId) => {
      if (err) return res.status(500).json({ error: "Failed to generate user ID" });

      userModel.createUser(username, email, password, userId, contactNumber, (err) => {
        if (err) return res.status(500).json({ error: "Failed to create user" });

        userModel.insertNotification(username, (err) => {
          if (err) {
            return res.status(500).json({
              error: "User created but failed to create notification",
            });
          }

          return res.status(200).json({
            message: "User created successfully and notification sent",
          });
        });
      });
    });
  });
};


// Login logic for regular user
exports.login = (req, res) => {
  const { contact_number, password } = req.body;

  if (!contact_number || !password) {
    return res.status(400).json({ message: "contact_number and password are required" });
  }

  userModel.loginUser(contact_number, password, (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      contact_number: user.contact_number,
      email: user.email,
      user_id: user.user_id,
      username: user.username,
      message: "Login successful",
    });
  });
};

// Admin login logic
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  adminModel.loginAdmin(username, password, (err, admin) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      username: admin.username,
      email: admin.email,
      message: "Login successful",
    });
  });
};

// Staff login logic
exports.staffLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  staffModel.loginStaff(username, password, (err, staff) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!staff) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Staff login successful",
      staff: {
        id: staff.id,
        username: staff.username,
        role: staff.role,
        staffname: staff.staffname,
      },
    });
  });
};



exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Old and new passwords are required",
    });
  }

  adminModel.verifyOldPassword(oldPassword, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    adminModel.updatePassword(oldPassword, newPassword, (err) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    });
  });
};