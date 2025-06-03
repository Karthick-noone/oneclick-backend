const secondhandproductsModel = require('../../models/products/secondhandproductsModel');

const fs = require('fs');
const generateProductId = require('../../utils/generateProductId');

exports.uploadsecondhandproductsImages = (req, res) => {
    const productId = req.body.productId;
    const newImages = req.files.map((file) => file.filename);
  
    console.log(`Received upload request for product ID: ${productId}`);
    console.log("New images:", newImages);
  
    secondhandproductsModel.getExistingImages(productId, (err, existingImages) => {
      if (err) return res.status(500).send("Error fetching product images");
  
      if (!existingImages) return res.status(404).send("Product not found");
  
      const updatedImages = [...existingImages, ...newImages];
  
      secondhandproductsModel.updateProductImages(productId, updatedImages, (err, affectedRows) => {
        if (err) return res.status(500).send("Error updating product images");
  
        if (affectedRows === 0) return res.status(404).send("No rows updated");
  
        res.send("Images uploaded and updated successfully");
      });
    });
  };

exports.addsecondhandproductsProduct = (req, res) => {
    const {
      name,
      features,
      productStatus,
      price,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
  
    // Hardcoding category as 'secondhandproducts'
    const category = "secondhandproducts";  // Set category as secondhandproducts
  
    const images = req.files.map((file) => file.filename);
  
    secondhandproductsModel.addProduct({
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      category,  // Category is now hardcoded as 'secondhandproducts'
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
  

// 3. Fetch all secondhandproducts products for admin
exports.fetchsecondhandproductsProducts = (req, res) => {
  secondhandproductsModel.fetchAllProducts((err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

// 4. Fetch approved secondhandproducts products
exports.fetchApprovedsecondhandproductsProducts = (req, res) => {
  secondhandproductsModel.fetchApprovedProducts((err, products) => {
    if (err) return res.status(err.status).send(err.message);
    res.json(products);
  });
};

exports.updatesecondhandproductsProduct = (req, res) => {
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
      secondhandproductsModel.getOldImages(productId, (err, results) => {
        if (err) return res.status(500).send(err);
  
        const oldImages = JSON.parse(results[0].prod_img);
        if (oldImages && oldImages.length > 0) {
          oldImages.forEach((img) => {
            fs.unlink(`uploads/secondhandproducts/${img}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }
  
        secondhandproductsModel.updateProductWithImages(productId, productData, (err, result) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully with multiple images" });
        });
      });
    } else {
      secondhandproductsModel.updateProductWithoutImages(productId, productData, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  };
  

// 6. Update a specific image of a secondhandproducts product
exports.updatesecondhandproductsImage = (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index);
  
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
  
    if (isNaN(imageIndex) || imageIndex < 0) {
      return res.status(400).json({ message: "Invalid image index" });
    }
  
    secondhandproductsModel.updateProductImage(productId, imageIndex, req.file.filename, (err, message) => {
      if (err) return res.status(err.status).json({ message: err.message });
      res.json({ message });
    });
  };

// Delete a specific image of a secondhandproducts product
exports.deletesecondhandproductsImage = (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index);
  
    if (isNaN(imageIndex)) {
      return res.status(400).json({ message: "Invalid or missing image index." });
    }
  
    secondhandproductsModel.deleteProductImage(productId, imageIndex, (err, message) => {
      if (err) return res.status(err.status).json({ message: err.message });
      res.json({ message });
    });
  };
  

// 8. Delete a secondhandproducts product
exports.deletesecondhandproductsProduct = (req, res) => {
  const productId = req.params.id;

  secondhandproductsModel.deleteProduct(productId, (err, message) => {
    if (err) return res.status(err.status).send(err.message);
    res.send(message);
  });
};
