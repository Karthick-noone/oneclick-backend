const fs = require("fs");
const model = require("../../models/offerspage_model/productBannerModel");

exports.create = (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const {
    title = "product_banner",
    description = "",
    brand_name,
    category,
  } = req.body;

  let successCount = 0;

  files.forEach((file, index) => {
    const product = {
      title,
      description,
      brand_name,
      category,
      image: file.filename,
    };

    model.insertProduct(product, (err) => {
      if (err) console.error("Insert error:", err);
      else successCount++;

      if (index === files.length - 1) {
        res.json({ message: `${successCount} products added` });
      }
    });
  });
};

exports.fetchAll = (req, res) => {
  model.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(results);
  });
};

exports.update = (req, res) => {
  const { brand_name, category } = req.body;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;

  if (image) {
    // Delete old image before update
    model.getImageById(id, (err, results) => {
      if (err) return res.status(500).send(err);

      const oldImage = results[0]?.image;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }

model.updateProduct(id, { title: "product_banner", brand_name, category, image }, (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated with image" });
      });
    });
  } else {
model.updateProduct(id, { title: "product_banner", brand_name, category }, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product updated" });
    });
  }
};

exports.updateImage = (req, res) => {
  const id = req.params.id;
  const image = req.file?.filename;

  if (!image) return res.status(400).json({ error: "No image provided" });

  model.getImageById(id, (err, results) => {
    if (err) return res.status(500).send(err);

    const oldImage = results[0]?.image;
    if (oldImage && oldImage !== image) {
      fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    model.updateImage(id, image, (err) => {
      if (err) return res.status(500).json({ error: "Image update failed" });
      res.json({ message: "Image updated", updatedImage: image });
    });
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  model.getImageById(id, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch product" });

    const oldImage = results[0]?.image;
    if (oldImage) {
      fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    model.deleteProduct(id, (err) => {
      if (err) return res.status(500).json({ error: "Delete failed" });
      res.json({ message: "Product deleted" });
    });
  });
};
