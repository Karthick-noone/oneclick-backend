const db = require('../../config/db'); // Import the database connection

exports.searchSuggestions = (searchTerm, callback) => {
  const sql = `
    SELECT DISTINCT category, prod_name 
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