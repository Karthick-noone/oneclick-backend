const db = require('../../config/db'); // Import the database connection

exports.searchSuggestions = (searchTerm, callback) => {

  // console.log("[SearchSuggestions] searchTerm:", searchTerm);

  const sql = `
    SELECT DISTINCT p.category, p.prod_name, p.prod_img
    FROM oneclick_product_category p
    LEFT JOIN oneclick_branches b ON p.branch_id = b.id
    WHERE 
      p.productStatus = 'approved'
      AND (
           p.branch_id IS NULL
        OR b.status = 'active'
      )
      AND (
        REPLACE(LOWER(CONCAT_WS('', p.prod_name, p.prod_features)), ' ', '') LIKE ?
        OR REPLACE(LOWER(p.category), ' ', '') LIKE ?
      )
    ORDER BY 
      CASE 
        WHEN p.category IN ('Computers', 'Mobiles', 'CCTV', 'Printers') THEN 1
        WHEN p.category IN ('ComputerAccessories', 'MobileAccessories') THEN 2
        ELSE 3
      END
  `;

  // console.log("[SearchSuggestions] Executing SQL...");

  db.query(sql, [searchTerm, searchTerm], (err, rows) => {
    if (err) {
      console.error("[SearchSuggestions] ERROR:", err);
      return callback(err);
    }

    // console.log("[SearchSuggestions] Results Count:", rows.length);

    rows.forEach(r => {
      console.log(`--> product: ${r.prod_name} | category: ${r.category}`);
    });

    callback(null, rows);
  });
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
