const path = require("path");
const fs = require("fs");
const {
  insertMobileProduct,
  insertMobileFeatures,
  fetchProductImages,
  updateProductImages,
  fetchMobilesFromDB,
  checkProductExists,
  insertProduct,
  updateProduct,
  checkFeaturesExists,
  updateFeatures,
  fetchProductImage,
  deleteProduct,
  fetchMobiles
} = require("../../models/products/mobilesModel");

const generateProductId = () => "PRD" + Math.floor(10000 + Math.random() * 90000);

exports.uploadMobileImages = (req, res) => {
  const productId = req.body.productId;
  const newImages = req.files.map(file => file.filename);

  fetchProductImages(productId, (err, results) => {
    if (err) return res.status(500).send("Error fetching images");
    if (results.length === 0) return res.status(404).send("Product not found");

    const existingImages = JSON.parse(results[0].prod_img) || [];
    const updatedImages = [...existingImages, ...newImages];

    updateProductImages(productId, updatedImages, (err, result) => {
      if (err) return res.status(500).send("Error updating images");
      res.send("Images uploaded and updated successfully");
    });
  });
};

exports.addMobile = (req, res) => {
  console.log("\n==================== ADD MOBILE PRODUCT ====================");
  console.log("[Controller][Mobile] Incoming Body:", req.body);
  console.log("[Controller][Mobile] Incoming Files:", req.files);

  const {
    name, price, actual_price, label, deliverycharge, productStatus, subtitle,
    memory, storage, processor, camera, display, battery, os, network, others, branch_id,
    user_role, branch_name, actor_name, contact_person
  } = req.body;

  const prod_id = generateProductId();
  const images = req.files.map(file => file.filename);
  const branchIdNum = branch_id;

  console.log("[Controller][Mobile] Generated prod_id:", prod_id);
  console.log("[Controller][Mobile] Images:", images);
  console.log("[Controller][Mobile] branch_id:", branchIdNum);

  insertMobileProduct(
    {
      prod_id,
      name,
      price,
      actual_price,
      label,
      deliverycharge,
      productStatus,
      subtitle,
      images,
      branch_id: branchIdNum,
      user_role,
      branch_name,
      actor_name,
      contact_person
    },
    (err) => {

      if (err) {
        console.error("[Controller][Mobile] ERROR inserting product:", err);
        return res.status(500).send("Error adding product");
      }

      console.log("[Controller][Mobile] Product Insert Success → Now inserting features");

      insertMobileFeatures(
        { prod_id, memory, storage, processor, camera, display, battery, os, network, others },
        (err) => {

          if (err) {
            console.error("[Controller][Mobile] ERROR inserting features:", err);
            return res.status(500).send("Error adding features");
          }

          console.log("[Controller][Mobile] Features Insert Success");
          console.log("✅ FINAL: Mobile Product + Features + Notification Done");
          console.log("==============================================================\n");

          res.send("Product and features added successfully");
        }
      );
    }
  );
};

exports.fetchMobiles = (req, res) => {
  fetchMobilesFromDB((err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching mobiles" });

    const products = results.map(p => ({ ...p, prod_img: JSON.parse(p.prod_img) }));
    res.json(products);
  });
};

exports.updateMobileImage = (req, res) => {
  const productId = req.params.id;
  const index = parseInt(req.query.index);
  const newImage = req.file.filename;

  fetchProductImages(productId, (err, results) => {
    if (err || results.length === 0) return res.status(500).send("Error fetching product");

    let images = JSON.parse(results[0].prod_img);
    const oldImagePath = path.join("uploads/mobiles", images[index]);

    fs.unlink(oldImagePath, (err) => {
      if (err) console.error("Failed to delete old image:", err);
    });

    images[index] = newImage;

    updateProductImages(productId, images, (err) => {
      if (err) return res.status(500).send("Error updating image");
      res.json({ message: "Image updated successfully" });
    });
  });
};

exports.deleteMobileImage = (req, res) => {
  const productId = req.params.id;
  const index = parseInt(req.query.index);

  fetchProductImages(productId, (err, results) => {
    if (err || results.length === 0) return res.status(500).send("Product not found");

    let images = JSON.parse(results[0].prod_img);
    const oldImagePath = path.join("uploads/mobiles", images[index]);

    fs.unlink(oldImagePath, (err) => {
      if (err) return res.status(500).send("Error deleting image file");

      images.splice(index, 1);

      updateProductImages(productId, images, (err) => {
        if (err) return res.status(500).send("Error updating DB");
        res.json({ message: "Image deleted successfully" });
      });
    });
  });
};

exports.updateMobile = (req, res) => {
  const productId = req.params.id;
  const data = req.body;

  checkProductExists(productId, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Check failed", error: err });
    }

    const handleFeatureUpdate = () => {
      checkFeaturesExists(productId, (err, featureRes) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Feature check failed", error: err });
        }

        if (featureRes.length === 0) {
          insertMobileFeatures({ prod_id: productId, ...data }, (err) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Insert features failed", error: err });
            }

            return res.json({
              success: true,
              message: "Product updated and features inserted.",
              updatedProduct: { prod_id: productId, ...data }
            });
          });
        } else {
          updateFeatures(productId, data, (err) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Update features failed", error: err });
            }

            return res.json({
              success: true,
              message: "Product and features updated.",
              updatedProduct: { prod_id: productId, ...data }
            });
          });
        }
      });
    };

    if (result.length === 0) {
      insertProduct(productId, data, (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Insert product failed", error: err });
        }

        handleFeatureUpdate();
      });
    } else {
      updateProduct(productId, data, (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Update product failed", error: err });
        }

        handleFeatureUpdate();
      });
    }
  });
};


exports.deleteMobile = (req, res) => {
  const productId = req.params.id;

  fetchProductImage(productId, (err, results) => {
    if (err || !results[0]) return res.status(500).send("Product not found");

    const image = results[0].prod_img;
    const imagePath = path.join("uploads/mobiles", image);

    fs.unlink(imagePath, () => {
      deleteProduct(productId, (err) => {
        if (err) return res.status(500).send("Delete failed");
        res.json({ message: "Product deleted successfully" });
      });
    });
  });
};



exports.adminFetchMobiles = (req, res) => {
  const { branch_id, userRole } = req.query;
  // console.log("\n🚀 [Controller] GET /adminfetchmobiles called");
  // console.log("➡️  branch_id:", branch_id);
  // console.log("➡️  userRole:", userRole);

  fetchMobiles(branch_id, userRole, (err, results) => {
    if (err) {
      console.error("❌ [Controller] Error fetching mobiles:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // console.log("🧩 [Controller] Raw Results Count:", results.length);

    const products = results.map((product) => {
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(product.prod_img);
      } catch (e) {
        console.warn(`⚠️ [Controller] Invalid JSON in prod_img for prod_id ${product.prod_id}`);
      }
      return { ...product, prod_img: parsedImages };
    });

    // console.log(`✅ [Controller] Returning ${products.length} formatted products.`);
    res.json(products);
  });
};
