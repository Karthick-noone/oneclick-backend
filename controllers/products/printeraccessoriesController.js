const printeraccessoriesModel = require('../../models/products/printeraccessoriesModel');

const fs = require('fs');
const generateProductId = require('../../utils/generateProductId');

exports.uploadprinteraccessoriesImages = (req, res) => {
    const productId = req.body.productId;
    const newImages = req.files.map((file) => file.filename);
  
    console.log(`Received upload request for product ID: ${productId}`);
    console.log("New images:", newImages);
  
    printeraccessoriesModel.getExistingImages(productId, (err, existingImages) => {
      if (err) return res.status(500).send("Error fetching product images");
  
      if (!existingImages) return res.status(404).send("Product not found");
  
      const updatedImages = [...existingImages, ...newImages];
  
      printeraccessoriesModel.updateProductImages(productId, updatedImages, (err, affectedRows) => {
        if (err) return res.status(500).send("Error updating product images");
  
        if (affectedRows === 0) return res.status(404).send("No rows updated");
  
        res.send("Images uploaded and updated successfully");
      });
    });
  };

exports.addprinteraccessoriesProduct = (req, res) => {
    const {
      name,
      features,
      productStatus,
      price,
      actual_price,
      effectiveprice,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
  
    // Hardcoding category as 'printeraccessories'
    const category = "PrinterAccessories";  // Set category as printeraccessories
  
    const images = req.files.map((file) => file.filename);
  
    printeraccessoriesModel.addProduct({
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      effectiveprice,
      category,  // Category is now hardcoded as 'printeraccessories'
      prod_id: generateProductId(), // Implement this function
      prod_name: name,
      prod_features: features,
      prod_price: price,
      prod_img: JSON.stringify(images),
      status: "available",
    }, (err, message) => {
      if (err) return res.status(err.status).send(err.message);
      res.send(message);
    });
  };
  

// 3. Fetch all printeraccessories products for admin
exports.fetchprinteraccessoriesProducts = (req, res) => {
  printeraccessoriesModel.fetchAllProducts((err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

// 4. Fetch approved printeraccessories products
exports.fetchApprovedprinteraccessoriesProducts = (req, res) => {
  printeraccessoriesModel.fetchApprovedProducts((err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

exports.updateprinteraccessoriesProduct = (req, res) => {
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
      effectiveprice,
    } = req.body;
  
    const images = req.files.map((file) => file.filename);
  
    const productData = {
      productStatus,
      subtitle,
      deliverycharge,
      actual_price,
      effectiveprice,
      label,
      name,
      features,
      price,
      status,
      images,
    };
  
    if (images.length > 0) {
      printeraccessoriesModel.getOldImages(productId, (err, results) => {
        if (err) return res.status(500).send(err);
  
        const oldImages = JSON.parse(results[0].prod_img);
        if (oldImages && oldImages.length > 0) {
          oldImages.forEach((img) => {
            fs.unlink(`uploads/printeraccessories/${img}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }
  
        printeraccessoriesModel.updateProductWithImages(productId, productData, (err, result) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully with multiple images" });
        });
      });
    } else {
      printeraccessoriesModel.updateProductWithoutImages(productId, productData, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  };
  

// 6. Update a specific image of a printeraccessories product
exports.updateprinteraccessoriesImage = (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index);
  
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
  
    if (isNaN(imageIndex) || imageIndex < 0) {
      return res.status(400).json({ message: "Invalid image index" });
    }
  
    printeraccessoriesModel.updateProductImage(productId, imageIndex, req.file.filename, (err, message) => {
      if (err) return res.status(err.status).json({ message: err.message });
      res.json({ message });
    });
  };

// Delete a specific image of a printeraccessories product
exports.deleteprinteraccessoriesImage = (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index);
  
    if (isNaN(imageIndex)) {
      return res.status(400).json({ message: "Invalid or missing image index." });
    }
  
    printeraccessoriesModel.deleteProductImage(productId, imageIndex, (err, message) => {
      if (err) return res.status(err.status).json({ message: err.message });
      res.json({ message });
    });
  };
  

// 8. Delete a printeraccessories product
exports.deleteprinteraccessoriesProduct = (req, res) => {
  const productId = req.params.id;

  printeraccessoriesModel.deleteProduct(productId, (err, message) => {
    if (err) return res.status(err.status).send(err.message);
    res.send(message);
  });
};
