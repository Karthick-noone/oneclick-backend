const db = require("../../config/db");

const getProductDetailsById = (id, callback) => {
  const query = `
    SELECT
      p.*,
      f.*,
      p.prod_id AS prod_id,
      f.prod_id AS feature_prod_id
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f 
      ON p.prod_id = f.prod_id
    WHERE p.id = ?
  `;

  console.log("🔍 Fetching product details for:", id);

  db.query(query, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(new Error("Product not found"));

    let product = results[0];

    console.log("📌 RAW RESULT:", product);
    console.log("✔ FINAL prod_id (correct):", product.prod_id);
    console.log("✔ feature_prod_id:", product.feature_prod_id);

    // Convert images
    try {
      product.prod_img = JSON.parse(product.prod_img || "[]");
    } catch {
      product.prod_img = [];
    }

    const basePrice = Number(product.prod_price);

    if (!product.branch_id) {
      console.log("✔ Super Admin Product → no margin");
      product.prod_price = basePrice;
      return callback(null, product);
    }

    const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

    db.query(marginSql, (err, marginRules) => {
      if (err) {
        console.error("❌ Margin fetch error:", err);
        product.prod_price = basePrice;
        return callback(null, product);
      }

      const rule = marginRules.find(
        (m) => basePrice >= m.range_from && basePrice <= m.range_to
      );

      if (!rule) {
        console.log("⚠ No margin rule match");
        product.prod_price = basePrice;
        return callback(null, product);
      }

      product.prod_price = basePrice + Number(rule.margin_amount);

      console.log("✔ Final Product ID:", product.prod_id);
      return callback(null, product);
    });
  });
};




const getRelatedProductsByCategory = (category, callback) => {
  const sql = `
    SELECT * 
    FROM oneclick_product_category
    WHERE category = ?
  `;

  db.query(sql, [category], (err, products) => {
    if (err) return callback(err);
    if (!products || products.length === 0) return callback(null, []);

    // Fetch margin rules
    const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

    db.query(marginSql, (mErr, marginRules) => {
      if (mErr) {
        console.error("❌ Error fetching margin rules:", mErr);
        return callback(null, products); // fallback → no margin applied
      }

      // Apply margin logic to EVERY product
      const updatedProducts = products.map((p) => {
        let basePrice = Number(p.prod_price);

        // If no branch_id → super admin → NO margin
        if (!p.branch_id) {
          p.prod_price = basePrice;
          return p;
        }

        // Find matching rule
        const rule = marginRules.find(
          (m) => basePrice >= m.range_from && basePrice <= m.range_to
        );

        if (!rule) {
          p.prod_price = basePrice;
          return p;
        }

        const marginAdded = Number(rule.margin_amount);
        const finalPrice = basePrice + marginAdded;

        console.log(
          `📌 Related Product Margin Applied: Base ₹${basePrice} + ₹${marginAdded} = ₹${finalPrice}`
        );

        p.prod_price = finalPrice; // overwrite price

        return p;
      });

      return callback(null, updatedProducts);
    });
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