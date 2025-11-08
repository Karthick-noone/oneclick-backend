const db = require("../../config/db");

exports.insertMobileProduct = (data, cb) => {
  console.log("[MobileProduct][Insert] Incoming Data:", data);

  const sql = `
    INSERT INTO oneclick_product_category 
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status, branch_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  console.log("[MobileProduct][Insert] Executing SQL Insert...");

  db.query(
    sql,
    [
      data.productStatus,
      data.deliverycharge,
      data.subtitle,
      data.label,
      data.actual_price,
      "Mobiles",
      data.prod_id,
      data.name,
      data.price,
      JSON.stringify(data.images),
      "available",
      data.branch_id,
    ],
    (err, result) => {
      if (err) {
        console.error("[MobileProduct][Insert] ERROR inserting product:", err);
        return cb(err);
      }

      console.log("[MobileProduct][Insert] SUCCESS — ID:", result.insertId);

      // -------- ADD NOTIFICATION LOGIC HERE -------------
      console.log("[Notification] Checking if notification is needed... Role:", data.user_role);

      if (data.user_role === "branch_admin" || data.user_role === "Staff") {

        const who =
          data.user_role === "branch_admin"
            ? `Branch Admin${data.branch_name ? ` - ${data.branch_name}` : ""}`
            : `Staff${data.actor_name ? ` - ${data.actor_name}` : ""}`;

        // ✅ final notification message
        const message = `Mobiles: "${data.name}" added by ${data.contact_person} (${who}).`;

        console.log("[Notification] Creating notification with message:", message);

        const notifySQL = `
          INSERT INTO oneclick_notifications (type, message, is_read, created_at)
          VALUES (?, ?, 0, NOW())
        `;

        db.query(notifySQL, ["product_insert", message], (nErr, nRes) => {
          if (nErr) {
            console.error("[Notification] ERROR inserting notification:", nErr);
          } else {
            console.log("[Notification] SUCCESS — Notification ID:", nRes.insertId);
          }

          return cb(null, result);
        });

      } else {
        console.log("[Notification] NOT REQUIRED — role is Admin or unknown");
        return cb(null, result);
      }
    }
  );
};


exports.insertMobileFeatures = (data, cb) => {
  const sql = `
    INSERT INTO oneclick_mobile_features 
    (prod_id, memory, storage, processor, camera, display, battery, os, network, others) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    data.prod_id, data.memory, data.storage, data.processor,
    data.camera, data.display, data.battery, data.os, data.network, data.others
  ], cb);
};

exports.fetchProductImages = (id, cb) => {
  db.query("SELECT prod_img FROM oneclick_product_category WHERE id = ?", [id], cb);
};

exports.updateProductImages = (id, images, cb) => {
  db.query("UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?", [JSON.stringify(images), id], cb);
};

exports.fetchMobilesFromDB = (cb) => {
  const sql = `
    SELECT p.*, f.memory, f.storage, f.processor, f.camera, f.display, f.battery, f.os, f.network, f.others 
    FROM oneclick_product_category p 
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id 
    WHERE p.category = 'mobiles' AND productStatus = 'approved'
    ORDER BY p.id DESC`;
  db.query(sql, cb);
};


exports.checkProductExists = (prod_id, cb) => {
  db.query("SELECT * FROM oneclick_product_category WHERE prod_id = ?", [prod_id], cb);
};

exports.insertProduct = (prod_id, data, cb) => {
  const sql = `
    INSERT INTO oneclick_product_category 
    (prod_id, productStatus, deliverycharge, subtitle, actual_price, offer_label, prod_name, prod_price, status, branch_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?. ?)`;
  db.query(sql, [
    prod_id, data.productStatus, data.deliverycharge, data.subtitle,
    data.actual_price, data.label, data.name, data.price, data.status, data.branch_id,
  ], cb);
};

exports.updateProduct = (prod_id, data, cb) => {
  const sql = `
    UPDATE oneclick_product_category 
    SET productStatus = ?, deliverycharge = ?, subtitle = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, status = ?
    WHERE prod_id = ?`;
  db.query(sql, [
    data.productStatus, data.deliverycharge, data.subtitle,
    data.actual_price, data.label, data.name, data.price, data.status,
    prod_id
  ], cb);
};

exports.checkFeaturesExists = (prod_id, cb) => {
  db.query("SELECT * FROM oneclick_mobile_features WHERE prod_id = ?", [prod_id], cb);
};

exports.updateFeatures = (prod_id, data, cb) => {
  const sql = `
    UPDATE oneclick_mobile_features 
    SET memory = ?, storage = ?, processor = ?, camera = ?, display = ?, battery = ?, os = ?, network = ?, others = ?
    WHERE prod_id = ?`;
  db.query(sql, [
    data.memory, data.storage, data.processor, data.camera,
    data.display, data.battery, data.os, data.network, data.others,
    prod_id
  ], cb);
};

exports.fetchProductImage = (id, cb) => {
  db.query("SELECT prod_img FROM oneclick_product_category WHERE id = ?", [id], cb);
};


exports.deleteProduct = (id, cb) => {
  // 1 Remove productId from users' addtocart field if exists
  const fetchUsersQuery = "SELECT id, addtocart FROM oneclick_users WHERE JSON_SEARCH(addtocart, 'one', ?) IS NOT NULL";
  const productIdPattern = `${id}-`; // e.g., "181-"

  db.query(fetchUsersQuery, [productIdPattern + '%'], (err, userResults) => {
    if (err) {
      console.error("Error fetching user carts:", err);
      // Don't block deletion if this step fails
    }

    if (userResults && userResults.length > 0) {
      userResults.forEach((user) => {
        let cart = [];
        try {
          cart = JSON.parse(user.addtocart || "[]");
        } catch (e) {
          console.error(`Invalid addtocart JSON for user ${user.id}:`, e);
        }
        // Remove items matching productId
        const updatedCart = cart.filter(item => !item.startsWith(productIdPattern));

        const updateCartQuery = "UPDATE oneclick_users SET addtocart = ? WHERE id = ?";
        db.query(updateCartQuery, [JSON.stringify(updatedCart), user.id], (err) => {
          if (err) {
            console.error(`Failed to update cart for user ${user.id}:`, err);
          }
        });
      });
    }

    // 2 Proceed to delete product from oneclick_product_category
    const sql = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(sql, [id], cb);
  });
};

exports.fetchMobiles = (branch_id, userRole, cb) => {
  console.log("\n📱 [Model] Fetching Mobiles...");
  console.log("➡️  branch_id:", branch_id);
  console.log("➡️  userRole:", userRole);

  let sql = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price, 
      p.offer_price, 
      p.offer_start_time, 
      p.offer_end_time, 
      p.prod_img, 
      p.status,
      p.productStatus,
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
      p.branch_id
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'Mobiles'
  `;

  const params = [];

  // ✅ Branch filter logic
  if (branch_id && branch_id !== "null") {
    sql += " AND p.branch_id = ?";
    params.push(branch_id);
    // console.log("✅ [Model] Applied branch filter → branch_id =", branch_id);
  } else if (userRole !== "Admin") {
    sql += " AND 1=0";
    // console.log("🚫 [Model] User not admin and no branch_id — returning empty set.");
  } else {
    console.log("✅ [Model] Admin user — fetching all approved mobiles.");
  }

  sql += " ORDER BY p.id DESC";

  // console.log("🧾 [Model] Final SQL Query:\n", sql);
  // console.log("📦 [Model] Query Params:", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ [Model] Error executing query:", err);
      return cb(err);
    }

    // console.log(`✅ [Model] Fetched ${results.length} mobile products.`);
    cb(null, results);
  });
};
