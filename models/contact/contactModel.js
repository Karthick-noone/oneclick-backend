const db = require('../../config/db');

const Contact = {

  addContact: (contactData, callback) => {
    const { name, email, subject, message, number } = contactData;

    // Get current time from server in "YYYY-MM-DD HH:MM:SS" format (without timezone)
    const currentTime = new Date();
    const formattedDateTime = `${currentTime.getFullYear()}-${String(
      currentTime.getMonth() + 1
    ).padStart(2, "0")}-${String(currentTime.getDate()).padStart(2, "0")} ${String(
      currentTime.getHours()
    ).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}:${String(
      currentTime.getSeconds()
    ).padStart(2, "0")}`;

    console.log("Saving with timestamp:", formattedDateTime);

    // Check how many messages this number sent today
    const checkQuery = `
      SELECT COUNT(*) AS messageCount 
      FROM oneclick_contact_details 
      WHERE phone = ? AND DATE(created_at) = CURDATE()
    `;

    db.query(checkQuery, [number], (countErr, countResult) => {
      if (countErr) {
        return callback(countErr);
      }

      const messageCount = countResult[0].messageCount;

      if (messageCount >= 2) {
        // Already sent 2 messages today
        return callback(null, {
          status: "limit_reached",
          message: "You can only send 2 messages per day.",
        });
      }

      // Insert new message
      const insertQuery = `
        INSERT INTO oneclick_contact_details (name, email, subject, message, phone, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [name, email, subject, message, number, formattedDateTime];

      db.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) {
          return callback(insertErr);
        }

        callback(null, {
          status: "success",
          message: "Message saved successfully.",
          data: insertResult,
        });
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
  },

  // Fetch previous enquiries for a given number
  getPreviousEnquiries: (userNumber, callback) => {
    const query = "SELECT * FROM oneclick_contact_details WHERE phone = ? ORDER BY created_at DESC";
    db.query(query, [userNumber], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Fetch all enquiries
  getAllEnquiries: (callback) => {
    const query = "SELECT * FROM oneclick_contact_details ORDER BY created_at DESC";
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Mark enquiry as read
  markEnquiryAsRead: (id, callback) => {
    const query = "UPDATE oneclick_contact_details SET isRead = 1 WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};

module.exports = Contact;
