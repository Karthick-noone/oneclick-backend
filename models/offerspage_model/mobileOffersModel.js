const db = require("../../config/db");

const getMobileOffersPage = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM oneclick_offerspage WHERE category="mobiles" ORDER BY id DESC';
    db.query(sql, (err, results) => {
      if (err) reject("Error fetching products");
      else resolve(results);
    });
  });
};

const insertMobileOffer = (offer, brand_name, title, description, images) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO oneclick_offerspage 
      (offer, brand_name, title, description, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      sql,
      [offer, brand_name, title, description, "mobiles", images.join(",")],
      (err, result) => {
        if (err) reject("Error inserting into database");
        else resolve("Product added");
      }
    );
  });
};

const updateMobileOffer = (productId, title, description, brand_name, offer, image) => {
  return new Promise((resolve, reject) => {
    let sql = "UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name = ?, offer = ?";
    const values = [title, description, brand_name, offer];

    if (image) {
      sql += ", image = ? WHERE id = ?";
      values.push(image, productId);
    } else {
      sql += " WHERE id = ?";
      values.push(productId);
    }

    db.query(sql, values, (err) => {
      if (err) reject("Error updating database");
      else resolve("Product updated successfully");
    });
  });
};

const deleteMobileOffer = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM oneclick_offerspage WHERE id = ?";
    db.query(sql, [productId], (err) => {
      if (err) reject("Error deleting product");
      else resolve("Product deleted successfully");
    });
  });
};

const getImagesById = (productId, callback) => {
  const sql = "SELECT image FROM oneclick_offerspage WHERE id = ?";
  db.query(sql, [productId], callback);
};

const updateImagesById = (productId, imageData, callback) => {
  const sql = "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
  db.query(sql, [imageData, productId], callback);
};
const getProductDetailsOffersPage = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM oneclick_offerspage WHERE title="product_details" ORDER BY id DESC LIMIT 2';
    db.query(sql, (err, results) => {
      if (err) reject("Error fetching product details");
      else resolve(results);
    });
  });
};

const insertProductDetailsOffer = (offer, brand_name, category, description, images) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO oneclick_offerspage 
      (offer, brand_name, title, description, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [offer, brand_name, "product_details", description, category, images.join(",")],
      (err, result) => {
        if (err) reject("Error inserting into database");
        else resolve("Product details added");
      }
    );
  });
};

module.exports = {
  getMobileOffersPage,
  insertMobileOffer,
  updateMobileOffer,
  deleteMobileOffer,
  getImagesById,
  updateImagesById,
  insertProductDetailsOffer,
  getProductDetailsOffersPage
};


