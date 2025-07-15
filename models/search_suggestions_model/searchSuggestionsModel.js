const db = require('../../config/db'); // Import the database connection

exports.searchSuggestions = (searchTerm, callback) => {
  const sql = `
    SELECT DISTINCT category, prod_name, prod_img 
    FROM oneclick_product_category
    WHERE 
      REPLACE(LOWER(CONCAT_WS('', prod_name, prod_features)), ' ', '') LIKE ?
      OR REPLACE(LOWER(category), ' ', '') LIKE ?
    ORDER BY 
      CASE 
        WHEN category IN ('Computers', 'Mobiles', 'CCTV', 'Printers') THEN 1
        WHEN category IN ('ComputerAccessories', 'MobileAccessories') THEN 2
        ELSE 3
      END
  `;
  db.query(sql, [searchTerm, searchTerm], callback);
};

exports.searchCategoryOnly = (searchTerm, callback) => {
  const sql = `
    SELECT category 
    FROM oneclick_product_category
    WHERE REPLACE(LOWER(CONCAT_WS('', prod_name, prod_features)), ' ', '') LIKE ?
    ORDER BY 
      CASE 
        WHEN category IN ('Computers', 'Mobiles', 'CCTV', 'Printers') THEN 1
        WHEN category IN ('ComputerAccessories', 'MobileAccessories') THEN 2
        ELSE 3
      END
  `;
  db.query(sql, [searchTerm], callback);
};

exports.getProductByName = (prodName, callback) => {
  const query = `
    SELECT * FROM oneclick_product_category 
    WHERE prod_name LIKE ? 
    LIMIT 1
  `;
  db.query(query, [`%${prodName}%`], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]); // Single product
  });
};

exports.getProductWithFeatures = (prodId, callback) => {
  const query = `
    SELECT 
      p.*,
      f.feature_id,
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
    LEFT JOIN oneclick_mobile_features f
    ON p.prod_id = f.prod_id
    WHERE p.prod_id = ?
  `;

  db.query(query, [prodId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results); // Return flattened array
  });
};
