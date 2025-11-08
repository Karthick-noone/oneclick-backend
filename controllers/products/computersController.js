const db = require("../../config/db");
const fs = require("fs");
const path = require("path");

const {
  insertComputerProduct,
  insertComputerFeatures,
  fetchProductImages,
  updateProductImages,
  fetchAllComputers,
  checkProductExists,
  insertProduct,
  updateProduct,
  checkFeaturesExists,
  insertFeatures,
  updateFeatures,
  fetchProductImage,
  deleteProduct,
  getAllComputers
} = require("../../models/products/computersModel");

const generateProductId = () => {
  const prefix = "PRD";
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomDigits}`;
};

exports.uploadComputerImages = (req, res) => {
  const productId = req.body.productId;
  const newImages = req.files.map((file) => file.filename);

  fetchProductImages(productId, (err, results) => {
    if (err) return res.status(500).send("Error fetching product images");

    if (results.length > 0) {
      const existingImages = JSON.parse(results[0].prod_img || "[]");
      const updatedImages = [...existingImages, ...newImages];

      updateProductImages(productId, updatedImages, (err, result) => {
        if (err) return res.status(500).send("Error updating product images");

        if (result.affectedRows === 0) {
          res.status(404).send("Product not found");
        } else {
          res.send("Images uploaded and updated successfully");
        }
      });
    } else {
      res.status(404).send("Product not found");
    }
  });
};

exports.addComputerProduct = (req, res) => {
  console.log("\n==================== ADD COMPUTER PRODUCT ====================");
  console.log("[Controller] Incoming body:", req.body);
  console.log("[Controller] Incoming files:", req.files);

  const {
    name, price, category, actual_price, label, deliverycharge, productStatus,
    subtitle, memory, storage, processor, display, os, others, branch_id,
    user_role, branch_name, actor_name, contact_person,  } = req.body;

  const images = req.files.map((file) => file.filename);
  const prod_id = generateProductId();
  const branchIdNum = branch_id;

  console.log("[Controller] Generated prod_id:", prod_id);
  console.log("[Controller] Images:", images);

  insertComputerProduct(
    {
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      prod_id,
      name,
      price,
      images,
      branch_id: branchIdNum,

      // required for notification logic
      user_role,
      branch_name,
      actor_name,
      contact_person,
      user_role
    },
    (err, productResult) => {
      if (err) {
        console.error("[Controller] ERROR inserting product:", err);
        return res.status(500).send("Error adding product");
      }

      console.log("[Controller] Product Insert Success →", productResult.insertId);

      insertComputerFeatures(
        { prod_id, memory, storage, processor, display, os, others },
        (err) => {
          if (err) {
            console.error("[Controller] ERROR inserting features:", err);
            return res.status(500).send("Error adding features");
          }

          console.log("[Controller] Features Insert Success");

          console.log("✅ FINAL: Product + Features + Notification Done");
          console.log("==============================================================\n");

          res.send("Product and features added successfully");
        }
      );
    }
  );
};


exports.fetchAllComputers = (req, res) => {
  const { branch_id, userRole } = req.query;

  getAllComputers(branch_id, userRole, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch products" });

    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img || "[]"),
    }));

    res.json(products);
  });
};


exports.fetchComputers = (req, res) => {
  const sql = `
    SELECT p.prod_id, p.prod_name, p.id, p.category, p.prod_price, p.actual_price,
      p.offer_price, p.offer_start_time, p.offer_end_time, p.prod_img, p.status,
      p.productStatus, p.deliverycharge, p.subtitle, p.offer_label,
      f.memory, f.storage, f.processor, f.display, f.os, f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'computers' AND p.productStatus = 'approved'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img || "[]"),
    }));

    res.json(products);
  });
};

exports.updateComputerImage = (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.query.index);

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Product not found");

    const images = JSON.parse(results[0].prod_img || "[]");

    if (imageIndex < 0 || imageIndex >= images.length) {
      return res.status(400).json({ message: "Invalid image index." });
    }

    const oldImagePath = `uploads/computers/${images[imageIndex]}`;
    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Failed to delete old image:", err);
    });

    images[imageIndex] = req.file.filename;
    const updateSql = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
    db.query(updateSql, [JSON.stringify(images), productId], (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product image updated successfully" });
    });
  });
};

exports.deleteComputerImage = (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.query.index);

  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).send("Error fetching old images");
    if (results.length === 0) return res.status(404).send("Product not found");

    const images = JSON.parse(results[0].prod_img || "[]");

    if (imageIndex < 0 || imageIndex >= images.length) {
      return res.status(400).json({ message: "Invalid image index." });
    }

    const oldImagePath = `uploads/computers/${images[imageIndex]}`;
    fs.unlink(oldImagePath, (err) => {
      if (err) return res.status(500).send("Error deleting image file");

      images.splice(imageIndex, 1);
      const updateSql = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
      db.query(updateSql, [JSON.stringify(images), productId], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product image deleted successfully" });
      });
    });
  });
};

exports.updateComputer = (req, res) => {
  const productId = req.params.id;
  const data = req.body;

  checkProductExists(productId, (err, results) => {
    if (err) return res.status(500).send({ message: "Check failed", error: err });

    const handleFeatureUpdate = () => {
      checkFeaturesExists(productId, (err, featureResult) => {
        if (err) return res.status(500).send({ message: "Feature check failed", error: err });

        if (featureResult.length === 0) {
          insertFeatures(productId, data, (err) => {
            if (err) return res.status(500).send({ message: "Insert features failed", error: err });
            res.json({ success: true, message: "Product updated and features inserted successfully." });
          });
        } else {
          updateFeatures(productId, data, (err) => {
            if (err) return res.status(500).send({ message: "Update features failed", error: err });
            res.json({ success: true, message: "Product and features updated successfully." });
          });
        }
      });
    };

    if (results.length === 0) {
      insertProduct(productId, data, (err) => {
        if (err) return res.status(500).send({ message: "Insert failed", error: err });
        insertFeatures(productId, data, (err) => {
          if (err) return res.status(500).send({ message: "Insert features failed", error: err });
          res.json({ message: "Product and features inserted successfully." });
        });
      });
    } else {
      updateProduct(productId, data, (err) => {
        if (err) return res.status(500).send({ message: "Update failed", error: err });
        handleFeatureUpdate();
      });
    }
  });
};

exports.deleteComputer = (req, res) => {
  const productId = req.params.id;

  fetchProductImage(productId, (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const images = results[0] && JSON.parse(results[0].prod_img || "[]");

    images.forEach((img) => {
      const imagePath = path.join("uploads/computers", img);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    });

    deleteProduct(productId, (err) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
};
