const db = require('../../config/db');

const Contact = {
  addContact: (contactData, callback) => {
    const { name, email, subject, message, number } = contactData;

    // Check if the email already exists
    const checkEmailQuery = `SELECT * FROM oneclick_contact_details WHERE email = ?`;
    db.query(checkEmailQuery, [email], (emailErr, emailResult) => {
      if (emailErr) {
        return callback(emailErr);
      }

      // Check if the phone number already exists
      const checkPhoneQuery = `SELECT * FROM oneclick_contact_details WHERE phone = ?`;
      db.query(checkPhoneQuery, [number], (phoneErr, phoneResult) => {
        if (phoneErr) {
          return callback(phoneErr);
        }

        // If neither exists, insert the new message
        if (emailResult.length === 0 && phoneResult.length === 0) {
          const insertQuery = `INSERT INTO oneclick_contact_details (name, email, subject, message, phone) VALUES (?, ?, ?, ?, ?)`;
          const values = [name, email, subject, message, number];

          db.query(insertQuery, values, callback);
        } else {
          // Construct the response message
          let responseMessage = "Message stored successfully";
          if (emailResult.length > 0) {
            responseMessage = "Email already exists.";
          }
          if (phoneResult.length > 0) {
            responseMessage = "Phone number already exists.";
          }
          callback(null, responseMessage);
        }
      });
    });
  },

  fetchContacts: (callback) => {
    const sql = "SELECT * FROM oneclick_contact_details ORDER BY id DESC";
    db.query(sql, callback);
  },

  deleteContact: (id, callback) => {
    const query = "DELETE FROM oneclick_contact_details WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = Contact;
