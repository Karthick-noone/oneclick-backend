const db = require("../../config/db"); // Adjust path if needed

exports.findUserByNumber = (number, callback) => {
  db.query("SELECT * FROM oneclick_users WHERE contact_number = ?", [number], callback);
};

exports.updateOtpByNumber = (otp, number, callback) => {
  db.query("UPDATE oneclick_users SET otp = ? WHERE contact_number = ?", [otp, number], callback);
};

exports.verifyOtp = (number, callback) => {
  db.query("SELECT * FROM oneclick_users WHERE contact_number = ?", [number], callback);
};

exports.updateOtpVerified = (number, callback) => {
  db.query("UPDATE oneclick_users SET otp_verified = ? WHERE contact_number = ?", [true, number], callback);
};

exports.updatePasswordByMobile = (mobile, password, callback) => {
  const query = "UPDATE oneclick_users SET password = ? WHERE contact_number = ?";
  db.query(query, [password, mobile], callback);
};


exports.getPasswordByMobile = (mobile, callback) => {
  const query = "SELECT password FROM oneclick_users WHERE contact_number = ?";
  db.query(query, [mobile], callback);
};
