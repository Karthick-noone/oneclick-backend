const EditHomePage = require('../../models/adpage_model/editHomePageModel');
const fs = require('fs');
const path = require('path');
const express =require("express")
// Serve static files for images
exports.serveStaticFiles = (app) => {
  app.use(
    "/backend/uploads/edithomepage",
    express.static(path.join(__dirname, "../uploads/edithomepage"))
  );
};

// Fetch all images
exports.fetchImages = (req, res) => {
  EditHomePage.fetchAll((err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      return res.status(500).json({ message: "Failed to fetch images" });
    }
    res.json(results);
  });
};

// Add a new image
exports.addImage = (req, res) => {
  const { category } = req.body;
  if (!req.file || !category) {
    return res.status(400).json({ error: "Image and category are required" });
  }

  const image = req.file.filename;
  EditHomePage.addImage([image, category], (err, result) => {
    if (err) {
      console.error("Error inserting image:", err);
      return res.status(500).json({ error: "Failed to add image" });
    }
    res.json({ message: "Image added successfully", id: result.insertId });
  });
};

// Update image and/or category
exports.updateImage = (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const newImage = req.file ? req.file.filename : null;

  if (!newImage && !category) {
    return res.status(400).json({ error: "Image or category is required" });
  }

  // Fetch the current record to get old image
  EditHomePage.getImageById(id, (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch current image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const oldImage = selectResult[0].image;

    // Build update fields and values
    let fields = [];
    let values = [];

    if (newImage) {
      fields.push("image = ?");
      values.push(newImage);
    }

    if (category) {
      fields.push("category = ?");
      values.push(category);
    }

    // Append ID for WHERE clause
    values.push(id);

    // Send to model
    EditHomePage.updateImage(fields, values, (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating record:", updateErr);
        return res.status(500).json({ error: "Failed to update record" });
      }

      // Delete old image if replaced
      if (newImage && oldImage) {
        const oldImagePath = path.join(__dirname, "../uploads/edithomepage", oldImage);
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting old image:", unlinkErr);
          }
        });
      }

      res.json({
        message: "Image and/or category updated successfully",
        updatedImage: newImage || "unchanged",
      });
    });
  });
};


exports.deleteImage = (req, res) => {
  const { id } = req.params;

  EditHomePage.getImageById(id, (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = selectResult[0].image;
    const imagePath = path.resolve(__dirname, "../../uploads/edithomepage", image);

    // Log the full path to debug
    console.log("Trying to delete:", imagePath);

    fs.access(imagePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.warn("File not found on disk:", imagePath);
      } else {
        // Delete the file only if it exists
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting image file:", unlinkErr);
            // Continue to delete DB record even if file delete fails
          } else {
            console.log("Image file deleted:", imagePath);
          }
        });
      }

      // Delete from database regardless
      EditHomePage.deleteImage(id, (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting image from database:", deleteErr);
          return res.status(500).json({ error: "Failed to delete image from database" });
        }

        res.json({ message: "Image deleted successfully" });
      });
    });
  });
};
