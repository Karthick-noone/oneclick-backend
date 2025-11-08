const db = require('../../config/db'); // Adjust the path as necessary
const fs = require('fs');
const path = require('path')
// 1. Add a product
exports.addProduct = (productData, callback) => {
  console.log("[Refurbished products][Insert] Incoming Data:", productData);

  const sql = `
    INSERT INTO oneclick_product_category
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status, branch_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, Object.values(productData), (err, result) => {
    if (err) {
      console.error("[Refurbished products][Insert] ERROR:", err);
      return callback({ status: 500, message: "Error adding product" });
    }

    console.log("[Refurbished products][Insert] SUCCESS — ID:", result.insertId);

    // --- notification logic ---
    if (productData.user_role === "branch_admin" || productData.user_role === "Staff") {

      const message = `Refurbished products: "${productData.prod_name}" added by ${productData.contact_person}(${productData.user_role === "branch_admin" ? "Branch Admin" : "Staff"}).`;

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

exports.addProductFeatures = (featuresData, callback) => {
  const sql = `
    INSERT INTO oneclick_mobile_features
    (prod_id, productType, memory, storage, battery, display, network, os, processor, others, camera)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    featuresData.prod_id,
    featuresData.productType,
    featuresData.memory,
    featuresData.storage,
    featuresData.battery,
    featuresData.display,
    featuresData.network,
    featuresData.os,
    featuresData.processor,
    featuresData.others,
    featuresData.camera,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting mobile features:", err);
      return callback(err);
    }
    callback(null, "Features added");
  });
};

exports.fetchAllProducts = (branch_id, userRole, callback) => {
  let sql = `
    SELECT pc.*, mf.memory,mf.camera, mf.storage, mf.battery, mf.display, mf.network, 
           mf.os, mf.processor, mf.others, mf.productType
    FROM oneclick_product_category pc
    LEFT JOIN oneclick_mobile_features mf ON pc.prod_id = mf.prod_id
    WHERE pc.category = 'secondhandproducts'
  `;

  const params = [];

  // Branch logic same as computers
  if (branch_id && branch_id !== "null") {
    sql += " AND pc.branch_id = ?";
    params.push(branch_id);

  } else if (userRole !== "Admin") {
    sql += " AND 1=0";

  } else {
    console.log("🟢 SecondHand → Admin → fetching products");
  }

  sql += " ORDER BY pc.id DESC"; // ← ORDER BY should be last ALWAYS

  db.query(sql, params, (err, results) => {
    if (err) {
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
    SELECT pc.*, mf.memory, mf.camera, mf.storage, mf.battery, mf.display, mf.network, 
           mf.os, mf.processor, mf.others, mf.productType
    FROM oneclick_product_category pc
    LEFT JOIN oneclick_mobile_features mf ON pc.prod_id = mf.prod_id
    WHERE pc.category = 'secondhandproducts' AND pc.productStatus = 'approved'
    ORDER BY pc.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching approved products:", err);
      return callback({ status: 500, message: "Failed to fetch approved products" });
    }

    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img),
    }));

    callback(null, products);
  });
};


exports.getOldImages = (productId, callback) => {
  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [productId], callback);
};

// Get prod_id from oneclick_product_category by internal product ID
exports.getProdIdByInternalId = (id, callback) => {
  const sql = "SELECT prod_id FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(new Error("Product not found"));
    callback(null, results[0].prod_id);
  });
};

exports.upsertProductFeatures = (data, callback) => {
  const checkSql = "SELECT feature_id FROM oneclick_mobile_features WHERE prod_id = ?";
  db.query(checkSql, [data.prod_id], (err, results) => {
    if (err) return callback(err);

    const values = [
      data.memory,
      data.storage,
      data.camera,
      data.display,
      data.battery,
      data.os,
      data.network,
      data.processor,
      data.others,
      data.productType,
      data.prod_id,
    ];

    if (results.length > 0) {
      // UPDATE
      const updateSql = `
        UPDATE oneclick_mobile_features 
        SET memory = ?, storage = ?, camera = ?, display = ?, battery = ?, os = ?, network = ?, processor = ?, others = ?, productType = ? 
        WHERE prod_id = ?`;
      db.query(updateSql, values, callback);
    } else {
      // INSERT
      const insertSql = `
        INSERT INTO oneclick_mobile_features 
        (memory, storage, camera, display, battery, os, network, processor, others, productType, prod_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(insertSql, values, callback);
    }
  });
};

exports.updateProductWithImages = (productId, data, callback) => {
  const sql = `
      UPDATE oneclick_product_category 
      SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, 
          offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?, 
          prod_img = ? 
      WHERE id = ?`;

  const values = [
    data.productStatus,
    data.subtitle,
    data.deliverycharge,
    data.actual_price,
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
      SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, 
          offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ? 
      WHERE id = ?`;

  const values = [
    data.productStatus,
    data.subtitle,
    data.deliverycharge,
    data.actual_price,
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

    const oldImagePath = path.join("uploads", "secondhandproducts", oldImages[imageIndex]);

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
    const oldImagePath = path.join("uploads", "secondhandproducts", imageToDelete);

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

exports.deleteProduct = (productId, callback) => {
  const fetchProductQuery = "SELECT prod_img, prod_id FROM oneclick_product_category WHERE id = ?";

  db.query(fetchProductQuery, [productId], (err, results) => {
    if (err) return callback({ status: 500, message: "Failed to fetch product details" });

    const product = results[0];
    if (!product) return callback({ status: 404, message: "Product not found" });

    const { prod_img, prod_id } = product;

    // 1 Remove productId from users' addtocart field if exists
    const fetchUsersQuery = "SELECT id, addtocart FROM oneclick_users WHERE JSON_SEARCH(addtocart, 'one', ?) IS NOT NULL";
    const productIdPattern = `${productId}-`; // e.g., "181-"

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

      // 2 Delete image(s) if found
      try {
        const images = JSON.parse(prod_img);
        images.forEach((img) => {
          const imagePath = `uploads/secondhandproducts/${img}`;
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Failed to delete image:", err);
          });
        });
      } catch (e) {
        console.error("Image parsing or deletion error:", e);
      }

      // 3 Delete product features first
      const deleteFeaturesQuery = "DELETE FROM oneclick_mobile_features WHERE prod_id = ?";
      db.query(deleteFeaturesQuery, [prod_id], (err) => {
        if (err) return callback({ status: 500, message: "Failed to delete product features" });

        // 4 Now delete the product itself
        const deleteProductQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
        db.query(deleteProductQuery, [productId], (err) => {
          if (err) return callback({ status: 500, message: "Failed to delete product" });
          callback(null, "Product and features deleted successfully");
        });
      });
    });
  });
};




exports.uploadsecondhandproductsImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const productId = req.body.productId;
  const newImages = req.files.map((file) => file.filename);

  secondhandproductsModel.updateProductImages(productId, newImages, (err, message) => {
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