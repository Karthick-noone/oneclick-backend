const db = require("../../config/db");

exports.fetchProductImages = (productId, callback) => {
  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [productId], callback);
};

exports.updateProductImages = (productId, images, callback) => {
  const sql = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
  db.query(sql, [JSON.stringify(images), productId], callback);
};

exports.insertComputerProduct = (data, callback) => {
  console.log("[ComputerProduct][Insert] Incoming Data:", data);

  const sql = `
    INSERT INTO oneclick_product_category 
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status, branch_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  console.log("[ComputerProduct][Insert] Executing SQL Insert...");

  db.query(
    sql,
    [
      data.productStatus,
      data.deliverycharge,
      data.subtitle,
      data.label,
      data.actual_price,
      "Computers",
      data.prod_id,
      data.name,
      data.price,
      JSON.stringify(data.images),
      "available",
      data.branch_id,
    ],
    (err, result) => {
      if (err) {
        console.error("[ComputerProduct][Insert] ERROR inserting product:", err);
        return callback(err);
      }

      console.log("[ComputerProduct][Insert] SUCCESS — ID:", result.insertId);

      // -------- ADD NOTIFICATION LOGIC HERE -------------
      console.log("[Notification] Checking if notification is needed... Role:", data.user_role);

      if (data.user_role === "branch_admin" || data.user_role === "Staff") {

        const who =
          data.user_role === "branch_admin"
            ? `Branch Admin${data.branch_name ? ` - ${data.branch_name}` : ""}`
            : `Staff${data.actor_name ? ` - ${data.actor_name}` : ""}`;

        // ✅ FIX — include contact_person (like mobiles)
        const message = `Computers: "${data.name}" added by ${data.contact_person} (${who}).`;

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

          return callback(null, result);
        });

      } else {
        console.log("[Notification] NOT REQUIRED — role is Admin or unknown");
        return callback(null, result);
      }
    }
  );
};


exports.insertComputerFeatures = (data, callback) => {
  const sql = `
    INSERT INTO oneclick_mobile_features 
    (prod_id, memory, storage, processor, display, os, others) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [data.prod_id, data.memory, data.storage, data.processor, data.display, data.os, data.others],
    callback
  );
};

exports.getAllComputers = (branch_id, userRole, callback) => {
  let sql = `
    SELECT 
      p.prod_id, p.prod_name, p.id, p.category, p.prod_price, p.actual_price, 
      p.offer_price, p.offer_start_time, p.offer_end_time, p.prod_img, p.status,
      p.productStatus, p.deliverycharge, p.subtitle, p.offer_label,
      f.memory, f.storage, f.processor, f.display, f.os, f.others,
      p.branch_id
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'computers'
  `;

  const params = [];

  //  Branch filter logic
  if (branch_id && branch_id !== "null") {
    // If branch_id is available, show that branch’s products only
    sql += " AND p.branch_id = ?";
    params.push(branch_id);
  } else if (userRole !== "Admin") {
    // If not admin and branch_id missing → no access
    sql += " AND 1=0";
  }

  sql += " ORDER BY p.id DESC";

  db.query(sql, params, callback);
};


exports.checkProductExists = (productId, cb) => {
  const sql = "SELECT * FROM oneclick_product_category WHERE prod_id = ?";
  db.query(sql, [productId], cb);
};

exports.insertProduct = (productId, data, cb) => {
  const sql = `
      INSERT INTO oneclick_product_category 
      (prod_id, productStatus, deliverycharge, subtitle, actual_price, offer_label, prod_name, prod_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    productId,
    data.productStatus || "",
    data.deliverycharge || 0,
    data.subtitle || "",
    data.actual_price || 0,
    data.label || "",
    data.name || "",
    data.price || 0,
    data.status || "",
  ];
  db.query(sql, values, cb);
};

exports.updateProduct = (productId, data, cb) => {
  const sql = `
      UPDATE oneclick_product_category 
      SET productStatus = ?, deliverycharge = ?, subtitle = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, status = ?
      WHERE prod_id = ?`;
  const values = [
    data.productStatus || "",
    data.deliverycharge || 0,
    data.subtitle || "",
    data.actual_price || 0,
    data.label || "",
    data.name || "",
    data.price || 0,
    data.status || "",
    productId,
  ];
  db.query(sql, values, cb);
};

exports.checkFeaturesExists = (productId, cb) => {
  const sql = "SELECT * FROM oneclick_mobile_features WHERE prod_id = ?";
  db.query(sql, [productId], cb);
};

exports.insertFeatures = (productId, data, cb) => {
  const sql = `
      INSERT INTO oneclick_mobile_features 
      (prod_id, memory, storage, processor, display, os, others) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    productId,
    data.memory || "",
    data.storage || "",
    data.processor || "",
    data.display || "",
    data.os || "",
    data.others || "",
  ];
  db.query(sql, values, cb);
};

exports.updateFeatures = (productId, data, cb) => {
  const sql = `
      UPDATE oneclick_mobile_features 
      SET memory = ?, storage = ?, processor = ?, display = ?, os = ?, others = ?
      WHERE prod_id = ?`;
  const values = [
    data.memory || "",
    data.storage || "",
    data.processor || "",
    data.display || "",
    data.os || "",
    data.others || "",
    productId,
  ];
  db.query(sql, values, cb);
};

exports.fetchProductImage = (id, cb) => {
  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [id], cb);
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
