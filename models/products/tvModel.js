const db = require('../../config/db'); // Adjust the path as necessary
const fs = require('fs');
const path =require ('path')
// 1. Add a product
exports.addProduct = (productData, callback) => {
  const sql = "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, Object.values(productData), (err, result) => {
    if (err) {
      console.error("Error inserting product into database:", err);
      return callback({ status: 500, message: "Error adding product" });
    }
    callback(null, "Product added with multiple images");
  });
};


// 2. Fetch all products
exports.fetchAllProducts = (callback) => {
  const sql = "SELECT * FROM oneclick_product_category WHERE category = 'tv' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return callback({ status: 500, message: "Failed to fetch products" });
    }
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img),
    }));
    callback(null, products);
  });
};

// 3. Fetch approved products
exports.fetchApprovedProducts = (callback) => {
  const sql = "SELECT * FROM oneclick_product_category WHERE category = 'tv' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return callback({ status: 500, message: "Failed to fetch products" });
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
  
      const oldImagePath = path.join("uploads", "tv", oldImages[imageIndex]);
  
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
      const oldImagePath = path.join("uploads", "tv", imageToDelete);
  
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
        const imagePath = `uploads/tv/${image}`;
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


exports.uploadtvImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    const productId = req.body.productId;
    const newImages = req.files.map((file) => file.filename);
  
    tvModel.updateProductImages(productId, newImages, (err, message) => {
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