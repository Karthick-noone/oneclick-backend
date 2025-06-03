const db = require("../../config/db"); // Adjust path based on your db file

exports.getAdditionalAccessories = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT additional_accessories FROM oneclick_product_category WHERE id = ?`;

    db.query(sql, [productId], (err, result) => {
      if (err) return reject(new Error("Error fetching additional accessories."));
      resolve(result.length ? result[0].additional_accessories : null);
    });
  });
};

exports.getCategoryAccessories = (category) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM oneclick_product_category WHERE category = ?`;

    db.query(sql, [category], (err, result) => {
      if (err) return reject(new Error("Error fetching accessories for category."));
      resolve(result);
    });
  });
};


exports.updateFrequentlyBuyAccessories = (id, accessoryIds) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE oneclick_product_category SET additional_accessories = ? WHERE id = ?`;
    db.query(sql, [accessoryIds, id], (err) => {
      if (err) return reject(new Error("Error updating accessories."));
      resolve();
    });
  });
};
