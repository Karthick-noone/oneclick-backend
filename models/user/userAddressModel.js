const db = require('../../config/db');

const UserAddress = {
  addAddress: (userId, addressData, callback) => {
    const updateQuery = "UPDATE oneclick_useraddress SET current_address = 0 WHERE user_id = ?";
    db.query(updateQuery, [userId], (err) => {
      if (err) {
        return callback(err);
      }

      const insertQuery = "INSERT INTO oneclick_useraddress (user_id, name, street, city, state, postal_code, country, phone, current_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        userId,
        addressData.name,
        addressData.street,
        addressData.city,
        addressData.state,
        addressData.postal_code,
        addressData.country,
        addressData.phone,
        1,
      ];

      db.query(insertQuery, values, callback);
    });
  },

  updateAddress: (addressId, updatedAddress, callback) => {
    const sql = "UPDATE oneclick_useraddress SET name = ?, street = ?, city = ?, state = ?, postal_code = ?, country = ?, phone = ? WHERE address_id = ?";
    db.query(sql, [
      updatedAddress.name,
      updatedAddress.street,
      updatedAddress.city,
      updatedAddress.state,
      updatedAddress.postal_code,
      updatedAddress.country,
      updatedAddress.phone,
      addressId,
    ], callback);
  },

  checkAddressExists: (userId, address, callback) => {
    const checkQuery = "SELECT COUNT(*) AS count FROM oneclick_useraddress WHERE user_id = ? AND name = ? AND street = ? AND city = ? AND state = ? AND postal_code = ? AND country = ? AND phone = ?";
    const values = [
      userId,
      address.name,
      address.street,
      address.city,
      address.state,
      address.postal_code,
      address.country,
      address.phone,
    ];

    db.query(checkQuery, values, callback);
  },

  checkPhoneNumber: (phone, userId, callback) => {
    const sql = "SELECT COUNT(*) AS count FROM oneclick_useraddress WHERE phone = ? AND user_id != ?";
    db.query(sql, [phone, userId], callback);
  },

  deleteAddress: (addressId, callback) => {
    const sql = "DELETE FROM oneclick_useraddress WHERE address_id = ?";
    db.query(sql, [addressId], callback);
  },

  fetchAddresses: (userId, callback) => {
    const query = "SELECT * FROM oneclick_useraddress WHERE user_id = ? ORDER BY address_id DESC";
    db.query(query, [userId], callback);
  },

  fetchSingleAddress: (userId, callback) => {
    const query = "SELECT * FROM oneclick_useraddress WHERE user_id = ? AND current_address = 1";
    db.query(query, [userId], callback);
  },

   updateCurrentAddress: (userId, addressId, callback) => {
    db.beginTransaction((err) => {
      if (err) throw err;

      const resetSql = "UPDATE oneclick_useraddress SET current_address = FALSE WHERE user_id = ?";
      db.query(resetSql, [userId], (error) => {
        if (error) {
          return db.rollback(() => {
            return callback(error);
          });
        }

        const updateSql = "UPDATE oneclick_useraddress SET current_address = TRUE WHERE user_id = ? AND address_id = ?";
        db.query(updateSql, [userId, addressId], (error, results) => {
          if (error) {
            return db.rollback(() => {
              return callback(error);
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                return callback(err);
              });
            }

            callback(null, results);
          });
        });
      });
    });
  }

};

module.exports = UserAddress;
