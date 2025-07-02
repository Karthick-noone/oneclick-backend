const path = require("path");
const fs = require("fs");
const model = require("../../models/adpage_model/doubleAdPageModel");

exports.fetchAll = async (req, res) => {
  try {
    const data = await model.fetchAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

exports.addImage = async (req, res) => {
  const { category } = req.body;
  const image = req.file?.filename;

  if (!image || !category) {
    return res.status(400).json({ error: "Image and category are required" });
  }

  try {
    const insertId = await model.insert(image, category);
    res.json({ message: "Image added successfully", id: insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add image" });
  }
};

// Update image and/or category
// Update image and/or category
exports.updateImage = (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const newImage = req.file ? req.file.filename : null;

  if (!newImage && !category) {
    return res.status(400).json({ error: "Image or category is required" });
  }

  model.getImageById(id, (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch current image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const oldImage = selectResult[0].image;

    // Prepare update
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

    // Append id at the end for WHERE clause
    values.push(id);

    model
      .update(fields, values)
      .then(() => {
        // Delete old image
        if (newImage && oldImage) {
          const oldImagePath = path.join(__dirname, "../uploads/doubleadpage", oldImage);
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
      })
      .catch((err) => {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update record" });
      });
  });
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await model.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await model.delete(id);

    const filePath = path.resolve("uploads", "doubleadpage", image.image);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image file:", err);
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
};
