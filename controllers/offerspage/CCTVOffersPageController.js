const CCTVOffersPage = require("../../models/offerspage_model/CCTVOffersPage");
const fs = require("fs");

const getCctvOffers = async (req, res) => {
  try {
    const results = await CCTVOffersPage.getCctvOffersPage();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const addCctvOffer = async (req, res) => {
  try {
    const { offer, brand_name, title, description } = req.body;
    const images = req.files.map((file) => file.filename);

    if (!title) {
      return res.status(400).json({ error: "Title is missing!" });
    }

    await CCTVOffersPage.insertCctvOffer(
      offer,
      brand_name,
      title,
      description,
      images
    );
    res.send("Product added");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const updateCctvOffer = async (req, res) => {
  const productId = req.params.id;
  const { title, description, brand_name, offer } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    if (newImage) {
      // Delete old image
      CCTVOffersPage.getImagesById(productId, (err, results) => {
        if (!err && results.length > 0) {
          const oldImages = results[0].image?.split(",") || [];
          oldImages.forEach((img) => {
            fs.unlink(`uploads/offerspage/${img}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }
      });
    }

    await CCTVOffersPage.updateCctvOffer(
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
    res.status(500).send(err);
  }
};

const deleteCctvOffer = async (req, res) => {
  const productId = req.params.id;

  try {
    // Delete image files from disk
    CCTVOffersPage.getImagesById(productId, (err, results) => {
      if (!err && results.length > 0) {
        const images = results[0].image?.split(",") || [];
        images.forEach((img) => {
          fs.unlink(`uploads/offerspage/${img}`, (err) => {
            if (err) console.error("Failed to delete image:", err);
          });
        });
      }
    });

    await CCTVOffersPage.deleteCctvOffer(productId);
    res.status(200).json({ message: "Product deleted successfully" });
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

  CCTVOffersPage.getImagesById(productId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Error fetching images");
    }

    const oldImages = results[0].image?.split(",") || [];

    oldImages.forEach((img) => {
      const filePath = `uploads/offerspage/${img}`;
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete ${img}:`, err);
      });
    });

    CCTVOffersPage.updateImagesById(productId, newImage, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ updatedImages: newImage });
    });
  });
};

const deleteImage = (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  CCTVOffersPage.getImagesById(productId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).send("Failed to get current images");
    }

    const currentImages = results[0].image?.split(",") || [];

    // Detect deleted image
    const imageToDelete = currentImages.find((img) => !updatedImages.includes(img));

    if (imageToDelete) {
      fs.unlink(`uploads/offerspage/${imageToDelete}`, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    CCTVOffersPage.updateImagesById(productId, updatedImages.join(","), (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
};

module.exports = {
  getCctvOffers,
  addCctvOffer,
  updateCctvOffer,
  deleteCctvOffer,
  updateImage,
  deleteImage
};
