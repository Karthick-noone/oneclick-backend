const db = require('../../config/db'); // Adjust the path as necessary
const fs = require('fs');
const path =require ('path')
// 1. Add a product
exports.addProduct = (productData, callback) => {
  console.log("[Printer Accessories][Insert] Incoming Data:", productData);

  const sql = `
    INSERT INTO oneclick_product_category
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status, branch_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, Object.values(productData), (err, result) => {
    if (err) {
      console.error("[Printer Accessories][Insert] ERROR:", err);
      return callback({ status: 500, message: "Error adding product" });
    }

    console.log("[Printer Accessories][Insert] SUCCESS — ID:", result.insertId);

    // --- notification logic ---
    if (productData.user_role === "branch_admin" || productData.user_role === "Staff") {

      const message = `Printer Accessories: "${productData.prod_name}" added by ${productData.contact_person}(${productData.user_role === "branch_admin" ? "Branch Admin" : "Staff"}).`;

      const notifySQL = `
        INSERT INTO oneclick_notifications (type, message, is_read, created_at)
        VALUES ('product_insert', ?, 0, NOW())
      `;

      db.query(notifySQL, [message], () => {
        return callback(null, "Product added with multiple images");
      });

    } else {
      return callback(null, "Product added with multiple images");
    }
  });
};


// 2. Fetch all products
exports.fetchAllProducts = (branch_id, userRole, callback) => {
  let sql = `
    SELECT *
    FROM oneclick_product_category
    WHERE category = 'printeraccessories'
  `;

  const params = [];

  // Branch logic same as computers
  if (branch_id && branch_id !== "null") {
    sql += " AND branch_id = ?";
    params.push(branch_id);
    // console.log("🟢 CCTV → Branch Admin → branch_id =", branch_id);

  } else if (userRole !== "Admin") {
    sql += " AND 1=0";
    // console.log("🚫 CCTV → no branch_id and not admin → no access");

  } else {
    console.log("🟢 CCTV → Admin → fetching all CCTV products");
  }

  sql += " ORDER BY id DESC";

  // console.log("🧾 CCTV final SQL:", sql);
  // console.log("📌 CCTV params:", params);

  db.query(sql, params, (err, results) => {
    if (err) {
      // console.error("❌ CCTV error fetching products:", err);
      return callback({ status: 500, message: "Failed to fetch products" });
    }

    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img),
    }));

    callback(null, products);
  });
};

exports.fetchApprovedProducts = (callback) => {

  const sql = `
    SELECT p.*
    FROM oneclick_product_category p
    LEFT JOIN oneclick_branches b ON p.branch_id = b.id
    WHERE 
      p.category = 'printeraccessories'
      AND p.productStatus = 'approved'
      AND (
            p.branch_id IS NULL      /* no branch -> allow */
         OR b.status = 'active'      /* branch active -> allow */
      )
    ORDER BY p.id DESC
  `;

  console.log("[fetchApprovedProducts] Executing SQL...");

  db.query(sql, (err, results) => {
    if (err) {
      console.error("[fetchApprovedProducts] ERROR fetching products:", err);
      return callback({ status: 500, message: "Failed to fetch products" });
    }

    console.log("[fetchApprovedProducts] Results Count:", results.length);

    let products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img || "[]"),
    }));

    // ⭐ Fetch margin rules
    const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

    db.query(marginSql, (mErr, marginRules) => {
      if (mErr) {
        console.error("[Margin] Error loading margin rules:", mErr);
        // return original (fallback)
        return callback(null, products);
      }

      // ⭐ Apply margin logic
      const updatedProducts = products.map((p) => {
        const basePrice = Number(p.prod_price);

        // Super admin product → NO margin
        if (!p.branch_id) {
          return { ...p, prod_price: basePrice };
        }

        // Branch admin product → apply margin
        const rule = marginRules.find(
          (r) => basePrice >= r.range_from && basePrice <= r.range_to
        );

        const finalPrice = rule
          ? basePrice + Number(rule.margin_amount)
          : basePrice;

        return { ...p, prod_price: finalPrice };
      });

      callback(null, updatedProducts);
    });
  });
};



exports.getOldImages = (productId, callback) => {
    const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    db.query(sql, [productId], callback);
  };
  
  exports.updateProductWithImages = (productId, data, callback) => {
    const sql = `
      UPDATE oneclick_product_category 
      SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, effectiveprice = ?,
          offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?, 
          prod_img = ? 
      WHERE id = ?`;
  
    const values = [
      data.productStatus,
      data.subtitle,
      data.deliverycharge,
      data.actual_price,
      data.effectiveprice,
      data.label,
      data.name,
      data.features,
      data.price,
      data.status,
      JSON.stringify(data.images),
      productId,
    ];
  
    db.query(sql, values, callback);
  };
  
  exports.updateProductWithoutImages = (productId, data, callback) => {
    const sql = `
      UPDATE oneclick_product_category 
      SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, effectiveprice = ?,
          offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ? 
      WHERE id = ?`;
  
    const values = [
      data.productStatus,
      data.subtitle,
      data.deliverycharge,
      data.actual_price,
      data.effectiveprice,
      data.label,
      data.name,
      data.features,
      data.price,
      data.status,
      productId,
    ];
  
    db.query(sql, values, callback);
  };
  
// 5. Update a specific image
exports.updateProductImage = (productId, imageIndex, newImage, callback) => {
    const sqlSelect = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    
    db.query(sqlSelect, [productId], (err, results) => {
      if (err) return callback({ status: 500, message: "Error fetching old images" });
      if (!results.length) return callback({ status: 404, message: "Product not found" });
  
      let oldImages;
      try {
        oldImages = JSON.parse(results[0].prod_img);
      } catch (e) {
        return callback({ status: 500, message: "Failed to parse image data" });
      }
  
      if (!Array.isArray(oldImages) || imageIndex < 0 || imageIndex >= oldImages.length) {
        return callback({ status: 400, message: "Invalid image index." });
      }
  
      const oldImagePath = path.join("uploads", "printeraccessories", oldImages[imageIndex]);
  
      fs.unlink(oldImagePath, (err) => {
        if (err) console.warn("Failed to delete old image:", err); // soft fail
      });
  
      oldImages[imageIndex] = newImage;
  
      const sqlUpdate = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
      db.query(sqlUpdate, [JSON.stringify(oldImages), productId], (err) => {
        if (err) return callback({ status: 500, message: "Error updating images in DB" });
        callback(null, "Product image updated successfully");
      });
    });
  };

// Delete a specific image
exports.deleteProductImage = (productId, imageIndex, callback) => {
    const oldImageQuery = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return callback({ status: 500, message: "Error fetching old images" });
  
      if (results.length === 0) {
        return callback({ status: 404, message: "Product not found" });
      }
  
      let oldImages;
      try {
        oldImages = JSON.parse(results[0].prod_img);
      } catch (e) {
        return callback({ status: 500, message: "Failed to parse image data" });
      }
  
      if (!Array.isArray(oldImages) || oldImages.length === 0) {
        return callback({ status: 400, message: "No images found for this product." });
      }
  
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        return callback({ status: 400, message: "Invalid image index." });
      }
  
      const imageToDelete = oldImages[imageIndex];
      const oldImagePath = path.join("uploads", "printeraccessories", imageToDelete);
  
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("File deletion error:", err);
          return callback({ status: 500, message: "Error deleting image file" });
        }
  
        oldImages.splice(imageIndex, 1);
  
        const updateQuery = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(updateQuery, [JSON.stringify(oldImages), productId], (err) => {
          if (err) return callback({ status: 500, message: "Error updating image data" });
          callback(null, "Product image deleted successfully");
        });
      });
    });
  };
// 7. Delete a product
exports.deleteProduct = (productId, callback) => {
  const fetchImageQuery = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) return callback({ status: 500, message: "Failed to fetch product image" });
    const image = results[0] && results[0].prod_img;

    // 1. Remove productId from users' addtocart field if exists
    const fetchUsersQuery = "SELECT id, addtocart FROM oneclick_users WHERE JSON_CONTAINS(addtocart, JSON_QUOTE(?))";
    const productIdPattern = productId + "-"; // e.g., "181-"

    db.query(fetchUsersQuery, [`${productIdPattern}1`], (err, userResults) => {
      if (err) return callback({ status: 500, message: "Failed to check user carts" });

      if (userResults.length > 0) {
        userResults.forEach((user) => {
          let cart = JSON.parse(user.addtocart || "[]");
          // Remove items matching productId
          cart = cart.filter((item) => !item.startsWith(productIdPattern));
          const updateCartQuery = "UPDATE oneclick_users SET addtocart = ? WHERE id = ?";
          db.query(updateCartQuery, [JSON.stringify(cart), user.id], (err) => {
            if (err) console.error(`Failed to update cart for user ${user.id}:`, err);
          });
        });
      }

      // 2. Delete product image from server
      if (image) {
        const imagePath = `uploads/printeraccessories/${image}`;
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }

      // 3. Delete product from oneclick_product_category
      const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
      db.query(deleteQuery, [productId], (err) => {
        if (err) return callback({ status: 500, message: "Failed to delete product" });
        callback(null, "Product deleted successfully");
      });
    });
  });
};


exports.uploadprinteraccessoriesImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const productId = req.body.productId;
    const newImages = req.files.map((file) => file.filename);
  
    printeraccessoriesModel.updateProductImages(productId, newImages, (err, message) => {
      if (err) return res.status(err.status).send(err.message);
      res.send(message);
    });
  };

  exports.getExistingImages = (productId, callback) => {
    const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    db.query(sql, [productId], (err, results) => {
      if (err) return callback(err);
  
      if (results.length === 0) return callback(null, null);
  
      const existingImages = JSON.parse(results[0].prod_img || "[]");
      callback(null, existingImages);
    });
  };
  
  exports.updateProductImages = (productId, updatedImages, callback) => {
    const sql = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
    db.query(sql, [JSON.stringify(updatedImages), productId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  };