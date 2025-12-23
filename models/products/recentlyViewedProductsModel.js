const db = require("../../config/db");

exports.getProductById = (id, callback) => {
  const query = "SELECT * FROM oneclick_product_category WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) return callback(err);
    if (!results || results.length === 0) return callback(null, results); // return empty array

    let product = results[0];
    const basePrice = Number(product.prod_price);

    // Super admin product → NO margin
    if (!product.branch_id) {
      product.prod_price = basePrice;

      // return array (controller expects array)
      return callback(null, [product]);
    }

    // Fetch margin rules
    const marginSql =
      "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

    db.query(marginSql, (err, marginRules) => {
      if (err || !marginRules) {
        product.prod_price = basePrice; // fallback
        return callback(null, [product]);
      }

      // Match margin rule
      const rule = marginRules.find(
        (m) => basePrice >= m.range_from && basePrice <= m.range_to
      );

      if (!rule) {
        product.prod_price = basePrice;
        return callback(null, [product]);
      }

      // Apply margin
      product.prod_price = basePrice + Number(rule.margin_amount);

      return callback(null, [product]); // Return same array structure
    });
  });
};
