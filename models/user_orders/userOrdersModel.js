const db = require('../../config/db');

const UserOrders = {
  fetchOrders: (userId, callback) => {
    const ordersQuery = `
      SELECT *
      FROM oneclick_orders
      WHERE user_id = ?
      ORDER BY order_id DESC
    `;

    db.query(ordersQuery, [userId], (orderError, orders) => {
      if (orderError) return callback(orderError);

      if (!orders || orders.length === 0) {
        return callback(null, { orders: [] });
      }

      const orderUniqueIds = orders.map(order => order.unique_id);
      const placeholders = orderUniqueIds.map(() => '?').join(',');

      const productsQuery = `
        SELECT 
          oi.order_id, 
          oi.product_id, 
          oi.quantity, 
          c.prod_name, 
          c.prod_features, 
          c.prod_price, 
          c.prod_img, 
          c.status, 
          c.category,
          c.deliverycharge
        FROM oneclick_order_items oi
        JOIN oneclick_product_category c ON oi.product_id = c.prod_id
        WHERE oi.order_id IN (${placeholders})
      `;

      db.query(productsQuery, orderUniqueIds, (prodError, products) => {
        if (prodError) return callback(prodError);

        const productsByOrder = {};
        products.forEach(product => {
          if (!productsByOrder[product.order_id]) {
            productsByOrder[product.order_id] = [];
          }
          productsByOrder[product.order_id].push({
            product_id: product.product_id,
            name: product.prod_name,
            features: product.prod_features,
            price: product.prod_price,
            image: product.prod_img,
            status: product.status,
            category: product.category,
            deliverycharge: product.deliverycharge,
            quantity: product.quantity,
            total_price: product.quantity * product.prod_price,
          });
        });

        const formattedOrders = orders.map(order => ({
          ...order,
          products: productsByOrder[order.unique_id] || [],
        }));

        callback(null, { orders: formattedOrders });
      });
    });
  },

  getOrderStatus: (orderId, callback) => {
    const query = `
      SELECT unique_id, payment_method, delivery_status, delivery_date, order_date 
      FROM oneclick_orders 
      WHERE unique_id = ?
    `;
    db.query(query, [orderId], callback);
  },

  fetchProductByOrderId: (orderId, callback) => {
    const query = `
      SELECT *
      FROM oneclick_order_items oi
      JOIN oneclick_orders o ON o.unique_id = oi.order_id
      WHERE o.unique_id = ?
    `;
    db.query(query, [orderId], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback(new Error("No products found for this order"));

      const productIdsWithQuantities = result.map(row => ({
        prod_id: row.product_id,
        quantity: row.quantity,
        is_buy_together: row.is_buy_together === 1,
      }));

      getProductDetails(productIdsWithQuantities, callback);
    });
  },

  getAllOrders: (callback) => {
    const query = `
      SELECT o.*, oi.order_item_id, oi.product_name, oi.quantity, oi.price, oi.product_description, oi.is_buy_together
      FROM oneclick_orders o
      LEFT JOIN oneclick_order_items oi ON o.unique_id = oi.order_id
      ORDER BY o.order_id DESC
    `;
    db.query(query, callback);
  },

  getUsersByIds: (userIds, callback) => {
    const placeholders = userIds.map(() => '?').join(',');
    const query = `
      SELECT user_id, username 
      FROM users 
      WHERE user_id IN (${placeholders})
    `;
    db.query(query, userIds, callback);
  }
};

function getProductDetails(productIdsWithQuantities, callback) {
  const placeholders = productIdsWithQuantities.map(() => '?').join(', ');
  const sql = `
    SELECT * 
    FROM oneclick_product_category 
    WHERE prod_id IN (${placeholders})
  `;

  db.query(sql, productIdsWithQuantities.map(p => p.prod_id), (err, result) => {
    if (err) return callback(err);
    if (result.length === 0) return callback(new Error("Products not found"));

    // ---------------------------
    // ⭐ EXISTING CODE (unchanged)
    // ---------------------------
    let combinedResults = result.map(product => {
      const matched = productIdsWithQuantities.find(p => p.prod_id === product.prod_id);
      return {
        ...product,
        quantity: matched ? matched.quantity : 0,
        is_buy_together: matched ? matched.is_buy_together : false,
      };
    });

    // ---------------------------
    // ⭐ NEW: FETCH MARGIN RULES
    // ---------------------------
    const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

    db.query(marginSql, (err, marginRules) => {
      if (err) {
        console.error("❌ Error loading margin rules:", err);
        // Return original result on error
        return callback(null, combinedResults);
      }

      console.log("\n====== APPLYING MARGIN FOR BUY-TOGETHER PRODUCTS ======");

      // ---------------------------
      // ⭐ APPLY MARGIN LOGIC
      // ---------------------------
      combinedResults = combinedResults.map(product => {
        const basePrice = Number(product.prod_price);

        console.log(`\n🛒 Product: ${product.prod_name} (${product.prod_id})`);
        console.log(`   Base Price: ₹${basePrice}`);
        console.log(`   Branch: ${product.branch_id || "Super Admin"}`);

        // 1️⃣ Super Admin → No margin
        if (!product.branch_id) {
          console.log("   ✔ No margin (Super Admin)");
          return { ...product, prod_price: basePrice };
        }

        // 2️⃣ Branch product → Check rule
        const rule = marginRules.find(
          r => basePrice >= r.range_from && basePrice <= r.range_to
        );

        if (!rule) {
          console.log("   ⚠ No margin rule → Price unchanged");
          return { ...product, prod_price: basePrice };
        }

        const finalPrice = basePrice + Number(rule.margin_amount);

        console.log(
          `   📌 Margin Applied: ₹${rule.margin_amount} → Final: ₹${finalPrice}`
        );

        return { ...product, prod_price: finalPrice };
      });

      console.log("\n====== DONE APPLYING MARGINS ======\n");

      // Return updated results
      return callback(null, combinedResults);
    });
  });
}


module.exports = UserOrders;
