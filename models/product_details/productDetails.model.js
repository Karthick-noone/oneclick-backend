const db = require("../../config/db");


// Function to get product details by ID including features
const getProductDetailsById = (id, callback) => {
    const query = `
      SELECT 
        p.prod_id, 
        p.prod_name,
        p.id, 
        p.category, 
        p.prod_price, 
        p.actual_price, 
        p.prod_features, 
        p.offer_price, 
        p.offer_start_time, 
        p.offer_end_time, 
        p.prod_img, 
        p.status,
        p.deliverycharge,
        p.subtitle,
        p.offer_label,
        f.memory, 
        f.storage, 
        f.processor, 
        f.camera, 
        f.display, 
        f.battery, 
        f.os, 
        f.network, 
        f.others,
        f.productType
      FROM oneclick_product_category p
      LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
      WHERE p.id = ?
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error("Product not found"));
  
      return callback(null, results[0]);
    });
  };
  

  // Function to get related products by category
const getRelatedProductsByCategory = (category, callback) => {
  const query = "SELECT * FROM oneclick_product_category WHERE category = ?";

  db.query(query, [category], (err, results) => {
    if (err) return callback(err);
    return callback(null, results);
  });
};

// Function to get related products with accessory mapping
const getRelatedProductsWithAccessories = (category, callback) => {
  // Define a mapping for main categories and their related subcategories
  const categoryMap = {
    Computers: "ComputerAccessories",
    CCTV: "CCTVAccessories",
    Mobiles: "MobileAccessories",
    Printers: "PrinterAccessories",
  };

  const relatedCategory = categoryMap[category] || category;
  const query = "SELECT * FROM oneclick_product_category WHERE category = ?";

  db.query(query, [relatedCategory], (err, results) => {
    if (err) return callback(err);
    return callback(null, results);
  });
};


// Fetch additional accessories using the productId
const getAdditionalAccessoriesByProductId = (productId, callback) => {
  const sql = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(sql, [productId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Fetch accessory details by accessory ID
const getAccessoryDetailsById = (accessoryId, callback) => {
  const sql = `
    SELECT *
    FROM oneclick_product_category  
    WHERE id = ?
  `;

  db.query(sql, [accessoryId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};


// Fetch all offers page products
const getAllOfferPageProducts = (callback) => {
  const sql = "SELECT * FROM oneclick_offerspage ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
  module.exports = {
    getProductDetailsById,
    getRelatedProductsByCategory,
    getRelatedProductsWithAccessories,
    getAdditionalAccessoriesByProductId,
  getAccessoryDetailsById,
  getAllOfferPageProducts
  };