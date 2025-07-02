const MobileOffersPage = require("../../models/offerspage_model/mobileOffersModel");
const fs = require("fs");
const path = require("path");

exports.fetchAll = (req, res) => {
  MobileOffersPage.getAll("mobiles", (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch product" });
    res.json(results);
  });
};

exports.createWithMultipleImages = (req, res) => {
  const { offer, brand_name, title, description } = req.body;

  const images = req.files.map((file) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const newName = `${title}_${timestamp}_${file.originalname}`;
    const oldPath = file.path;
    const newPath = path.join("uploads", "offerspage", newName);

    fs.renameSync(oldPath, newPath);
    return newName;
  });

  const values = [offer, brand_name, title, description, "mobiles", images.join(",")];

  MobileOffersPage.create(values, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Product added");
  });
};

exports.updateWithSingleImage = (req, res) => {
  const { title, description, brand_name, offer } = req.body;
  const id = req.params.id;

  if (req.file) {
    const ext = path.extname(req.file.originalname);
    const timestamp = Date.now();
    const newFilename = `${title}_${timestamp}${ext}`;
    const oldPath = req.file.path;
    const newPath = path.join("uploads", "offerspage", newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) return res.status(500).send({ message: "Rename failed", err });

      MobileOffersPage.getImageById(id, (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImage = results[0]?.image;
        if (oldImage && oldImage !== newFilename) {
          fs.unlink(`uploads/offerspage/${oldImage}`, () => {});
        }

        const values = [title, description, brand_name, offer, newFilename];
        MobileOffersPage.update(id, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    });
  } else {
    const values = [title, description, brand_name, offer];
    MobileOffersPage.updateWithoutImage(id, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product updated successfully" });
    });
  }
};

exports.updateImageOnly = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const ext = path.extname(req.file.originalname);
  const timestamp = Date.now();
  const newFilename = `${title}_${timestamp}${ext}`;

  const oldPath = path.join("uploads", "offerspage", req.file.filename);
  const newPath = path.join("uploads", "offerspage", newFilename);

  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.status(500).send({ message: "Failed to rename file", error: err });

    MobileOffersPage.getImageById(id, (err, results) => {
      if (err) return res.status(500).send(err);

      const oldImages = results[0]?.image?.split(",") || [];

      MobileOffersPage.updateImageOnly(id, newFilename, title, (err, results) => {
        if (err) return res.status(500).send(err);

        oldImages.forEach((img) => {
          fs.unlink(`uploads/offerspage/${img}`, (unlinkErr) => {
            if (unlinkErr) console.error(`Failed to delete ${img}:`, unlinkErr);
          });
        });

        res.json({ message: "Image updated with unique filename", image: newFilename });
      });
    });
  });
};

exports.deleteImage = (req, res) => {
  const id = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  MobileOffersPage.getImageById(id, (err, results) => {
    if (err) return res.status(500).send(err);

    const currentImages = results[0]?.image?.split(",") || [];
    if (currentImages.length !== updatedImages.length + 1) {
      return res.status(400).json({ message: "Image count mismatch" });
    }

    const imageToDelete = currentImages.find((img) => !updatedImages.includes(img));
    if (imageToDelete) {
      fs.unlink(`uploads/offerspage/${imageToDelete}`, () => {});
    }

    MobileOffersPage.updateImageOnly(id, updatedImages.join(","), null, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  MobileOffersPage.deleteProduct(productId, (err, result) => {
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
