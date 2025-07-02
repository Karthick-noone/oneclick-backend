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
  const {
    name, price, actual_price, label, deliverycharge, productStatus, subtitle,
    memory, storage, processor, camera, display, battery, os, network, others
  } = req.body;

  const prod_id = generateProductId();
  const images = req.files.map(file => file.filename);

  insertMobileProduct({ prod_id, name, price, actual_price, label, deliverycharge, productStatus, subtitle, images }, (err) => {
    if (err) return res.status(500).send("Error adding product");

    insertMobileFeatures({ prod_id, memory, storage, processor, camera, display, battery, os, network, others }, (err) => {
      if (err) return res.status(500).send("Error adding features");
      res.send("Product and features added successfully");
    });
  });
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
  fetchMobiles((err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
};