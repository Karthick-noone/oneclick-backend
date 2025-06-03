const fs = require("fs");
const OffersPage = require("../../models/offerspage_model/offersPageModel");

exports.fetchAll = (req, res) => {
  OffersPage.getAll("computers", (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch product" });
    res.json(results);
  });
};

exports.createWithMultipleImages = (req, res) => {
  const { offer, brand_name, title, description } = req.body;
  const images = req.files.map((file) => file.filename);
  const values = [offer, brand_name, title, description, "computers", images.join(",")];

  OffersPage.create(values, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Product added");
  });
};

exports.updateWithSingleImage = (req, res) => {
  const { title, description, brand_name, offer } = req.body;
  const id = req.params.id;
  const newImage = req.file ? req.file.filename : null;

  if (newImage) {
    OffersPage.getImageById(id, (err, results) => {
      if (err) return res.status(500).send(err);

      const oldImage = results[0]?.image;
      if (oldImage && oldImage !== newImage) {
        fs.unlink(`uploads/offerspage/${oldImage}`, () => {});
      }

      const values = [title, description, brand_name, offer, newImage];
      OffersPage.update(id, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    });
  } else {
    const values = [title, description, brand_name, offer];
    OffersPage.updateWithoutImage(id, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product updated successfully" });
    });
  }
};

exports.updateImageOnly = (req, res) => {
  const id = req.params.id;
  const newImage = req.file.filename;

  OffersPage.getImageById(id, (err, results) => {
    if (err) return res.status(500).send(err);

    const images = results[0]?.image?.split(",") || [];
    images.forEach((img) => {
      fs.unlink(`uploads/offerspage/${img}`, () => {});
    });

    OffersPage.updateImageOnly(id, newImage, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ updatedImages: newImage });
    });
  });
};

exports.deleteImage = (req, res) => {
  const id = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  OffersPage.getImageById(id, (err, results) => {
    if (err) return res.status(500).send(err);

    const currentImages = results[0]?.image?.split(",") || [];
    if (currentImages.length !== updatedImages.length + 1) {
      return res.status(400).json({ message: "Image count mismatch" });
    }

    const imageToDelete = currentImages.find((img) => !updatedImages.includes(img));
    if (imageToDelete) {
      fs.unlink(`uploads/offerspage/${imageToDelete}`, () => {});
    }

    OffersPage.updateImageOnly(id, updatedImages.join(","), (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  OffersPage.deleteProduct(productId, (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Failed to delete product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
};