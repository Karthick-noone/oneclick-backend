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

exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const newImage = req.file?.filename;

  if (!newImage && !category) {
    return res.status(400).json({ error: "Image or category is required" });
  }

  try {
    const old = await model.findById(id);
    if (!old) return res.status(404).json({ error: "Image not found" });

    const fields = [];
    const values = [];

    if (newImage) {
      fields.push("image = ?");
      values.push(newImage);
    }

    if (category) {
      fields.push("category = ?");
      values.push(category);
    }

    await model.update(fields.join(", "), values, id);

    // Delete old image if new one is uploaded
    if (newImage && old.image) {
      const oldPath = path.resolve("uploads", "doubleadpage", old.image);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    res.json({ message: "Updated successfully", updatedImage: newImage || old.image });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
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
