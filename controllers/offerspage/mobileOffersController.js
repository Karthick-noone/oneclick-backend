const MobileOffersPage = require("../../models/offerspage_model/mobileOffersModel");
const fs = require("fs");
const path = require("path");

const getMobileOffers = async (req, res) => {
  try {
    const results = await MobileOffersPage.getMobileOffersPage();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const addMobileOffer = async (req, res) => {
  try {
    const { offer, brand_name, title, description } = req.body;
    const images = req.files.map((file) => file.filename);

    if (!title) {
      return res.status(400).json({ error: "Title is missing!" });
    }

    await MobileOffersPage.insertMobileOffer(
      offer,
      brand_name,
      title,
      description,
      images
    );
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

const updateMobileOffer = async (req, res) => {
  const productId = req.params.id;
  const title = "product_details"; // Force title
  const { description, brand_name, offer } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    if (newImage) {
      MobileOffersPage.getImagesById(productId, (err, results) => {
        if (!err && results.length > 0) {
          const oldImages = results[0].image?.split(",") || [];
          oldImages.forEach((img) => {
            fs.unlink(path.join("uploads/offerspage", img), (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }
      });
    }

    await MobileOffersPage.updateMobileOffer(
      productId,
      title,
      description,
      brand_name,
      offer,
      newImage
    );

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteMobileOffer = async (req, res) => {
  const productId = req.params.id;

  try {
    MobileOffersPage.getImagesById(productId, (err, results) => {
      if (!err && results.length > 0) {
        const images = results[0].image?.split(",") || [];
        images.forEach((img) => {
          fs.unlink(path.join("uploads/offerspage", img), (err) => {
            if (err) console.error("Failed to delete image:", err);
          });
        });
      }
    });

    await MobileOffersPage.deleteMobileOffer(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const updateImage = (req, res) => {
  const productId = req.params.id;
  const newImage = req.file ? req.file.filename : null;

  if (!newImage) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  MobileOffersPage.getImagesById(productId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Error fetching images");
    }

    const oldImages = results[0].image?.split(",") || [];

    oldImages.forEach((img) => {
      fs.unlink(path.join("uploads/offerspage", img), (err) => {
        if (err) console.error(`Failed to delete ${img}:`, err);
      });
    });

    MobileOffersPage.updateImagesById(productId, newImage, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ updatedImages: newImage });
    });
  });
};

const deleteImage = (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  MobileOffersPage.getImagesById(productId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Failed to get current images");
    }

    const currentImages = results[0].image?.split(",") || [];
    const imageToDelete = currentImages.find((img) => !updatedImages.includes(img));

    if (imageToDelete) {
      fs.unlink(path.join("uploads/offerspage", imageToDelete), (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    MobileOffersPage.updateImagesById(productId, updatedImages.join(","), (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
};

const getProductDetailsOffers = async (req, res) => {
  try {
    const results = await MobileOffersPage.getProductDetailsOffersPage();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

const addProductDetailsOffer = async (req, res) => {
  try {
    const { offer, brand_name, category, description } = req.body;
    const images = req.files.map((file) => file.filename);

    await MobileOffersPage.insertProductDetailsOffer(
      offer,
      brand_name,
      category,
      description,
      images
    );
    res.status(201).json({ message: "Product details added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product details" });
  }
};

module.exports = {
  getMobileOffers,
  addMobileOffer,
  updateMobileOffer,
  deleteMobileOffer,
  updateImage,
  deleteImage,
  getProductDetailsOffers,
  addProductDetailsOffer
};
