const db = require("../../config/db"); // Assuming you have a config file for DB connection

// Fetch all products for CCTV category
const getCctvOffersPage = () => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM oneclick_offerspage WHERE category="cctv" ORDER BY id DESC';
    db.query(sql, (err, results) => {
      if (err) reject("Error fetching products");
      else resolve(results);
    });
  });
};

// Insert new offer
const insertCctvOffer = (offer, brand_name, title, description, images) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO oneclick_offerspage (offer, brand_name, title, description, category, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [offer, brand_name, title, description, "cctv", images.join(",")],
      (err, result) => {
        if (err) reject("Error inserting into database");
        else resolve("Product added");
      }
    );
  });
};

// Update existing offer
const updateCctvOffer = (productId, title, description, brand_name, offer, image) => {
  return new Promise((resolve, reject) => {
    let sql =
      "UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ? ";
    let values = [title, description, brand_name, offer];

    if (image) {
      sql += ", image = ? WHERE id = ?";
      values.push(image, productId);
    } else {
      sql += " WHERE id = ?";
      values.push(productId);
    }

    db.query(sql, values, (err, results) => {
      if (err) reject("Error updating database");
      else resolve("Product updated successfully");
    });
  });
};

// Delete product by ID
const deleteCctvOffer = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM oneclick_offerspage WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) reject("Error deleting product");
      else resolve("Product deleted successfully");
    });
  });
};

// Get current image(s) for a product
const getImagesById = (productId, callback) => {
  const sql = "SELECT image FROM oneclick_offerspage WHERE id = ?";
  db.query(sql, [productId], callback);
};

// Update image(s) for a product
const updateImagesById = (productId, imageData, callback) => {
  const sql = "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
  db.query(sql, [imageData, productId], callback);
};

module.exports = {
  getCctvOffersPage,
  insertCctvOffer,
  updateCctvOffer,
  deleteCctvOffer,
  getImagesById,
  updateImagesById
};
