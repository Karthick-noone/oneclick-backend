const speakersModel = require('../../models/products/speakersModel');

const fs = require('fs');
const generateProductId = require('../../utils/generateProductId');

exports.uploadspeakersImages = (req, res) => {
  const productId = req.body.productId;
  const newImages = req.files.map((file) => file.filename);

  console.log(`Received upload request for product ID: ${productId}`);
  console.log("New images:", newImages);

  speakersModel.getExistingImages(productId, (err, existingImages) => {
    if (err) return res.status(500).send("Error fetching product images");

    if (!existingImages) return res.status(404).send("Product not found");

    const updatedImages = [...existingImages, ...newImages];

    speakersModel.updateProductImages(productId, updatedImages, (err, affectedRows) => {
      if (err) return res.status(500).send("Error updating product images");

      if (affectedRows === 0) return res.status(404).send("No rows updated");

      res.send("Images uploaded and updated successfully");
    });
  });
};

exports.addspeakersProduct = (req, res) => {
  const {
    name,
    features,
    productStatus,
    price,
    actual_price,
    label,
    deliverycharge,
    subtitle,
    branch_id,
    user_role, branch_name, actor_name, contact_person
  } = req.body;

  // Hardcoding category as 'speakers'
  const category = "Speakers";  // Set category as speakers

  const images = req.files.map((file) => file.filename);
  const branchIdNum = branch_id
  speakersModel.addProduct({
    productStatus,
    deliverycharge,
    subtitle,
    label,
    actual_price,
    category,  // Category is now hardcoded as 'speakers'
    prod_id: generateProductId(), // Implement this function
    prod_name: name,
    prod_features: features,
    prod_price: price,
    prod_img: JSON.stringify(images),
    status: "available",
    branchIdNum,
    user_role, branch_name, actor_name, contact_person
  }, (err, message) => {
    if (err) return res.status(err.status).send(err.message);
    res.send(message);
  });
};


// 3. Fetch all speakers products for admin
exports.fetchspeakersProducts = (req, res) => {
  const { branch_id, userRole } = req.query
  speakersModel.fetchAllProducts(branch_id, userRole, (err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

// 4. Fetch approved speakers products
exports.fetchApprovedspeakersProducts = (req, res) => {
  speakersModel.fetchApprovedProducts((err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

exports.updatespeakersProduct = (req, res) => {
  const productId = req.params.id;
  const {
    productStatus,
    subtitle,
    deliverycharge,
    label,
    name,
    features,
    price,
    status,
    actual_price,
  } = req.body;

  const images = req.files.map((file) => file.filename);

  const productData = {
    productStatus,
    subtitle,
    deliverycharge,
    actual_price,
    label,
    name,
    features,
    price,
    status,
    images,
  };

  if (images.length > 0) {
    speakersModel.getOldImages(productId, (err, results) => {
      if (err) return res.status(500).send(err);

      const oldImages = JSON.parse(results[0].prod_img);
      if (oldImages && oldImages.length > 0) {
        oldImages.forEach((img) => {
          fs.unlink(`uploads/speakers/${img}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        });
      }

      speakersModel.updateProductWithImages(productId, productData, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully with multiple images" });
      });
    });
  } else {
    speakersModel.updateProductWithoutImages(productId, productData, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product updated successfully" });
    });
  }
};


// 6. Update a specific image of a speakers product
exports.updatespeakersImage = (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.query.index);

  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  if (isNaN(imageIndex) || imageIndex < 0) {
    return res.status(400).json({ message: "Invalid image index" });
  }

  speakersModel.updateProductImage(productId, imageIndex, req.file.filename, (err, message) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json({ message });
  });
};

// Delete a specific image of a speakers product
exports.deletespeakersImage = (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.query.index);

  if (isNaN(imageIndex)) {
    return res.status(400).json({ message: "Invalid or missing image index." });
  }

  speakersModel.deleteProductImage(productId, imageIndex, (err, message) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json({ message });
  });
};


// 8. Delete a speakers product
exports.deletespeakersProduct = (req, res) => {
  const productId = req.params.id;

  speakersModel.deleteProduct(productId, (err, message) => {
    if (err) return res.status(err.status).send(err.message);
    res.send(message);
  });
};
