const path = require("path");
const fs = require("fs");
const SingleAdPageModel = require("../../models/adpage_model/singleAdPageModel");

exports.fetchSingleAd = (req, res) => {
  SingleAdPageModel.fetchLatestImage((err, results) => {
    if (err) return res.status(500).json({ error: "Fetch failed" });
    res.json(results);
  });
};

exports.addSingleAd = (req, res) => {
  const { category } = req.body;
  if (!req.file || !category) {
    return res.status(400).json({ error: "Image and category required" });
  }

  SingleAdPageModel.insertImage(req.file.filename, category, (err, result) => {
    if (err) return res.status(500).json({ error: "Insert failed" });
    res.json({ message: "Image added", id: result.insertId });
  });
};

exports.updateSingleAd = (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const newImage = req.file ? req.file.filename : null;

  if (!newImage && !category) {
    return res.status(400).json({ error: "Image or category is required" });
  }

  SingleAdPageModel.getImageById(id, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Not found" });

    const oldImage = results[0].image;
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

    SingleAdPageModel.updateImage(fields, values, id, (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });

      if (newImage) {
        fs.unlink(path.join(__dirname, "../../uploads/singleadpage", oldImage), () => {});
      }

      res.json({ message: "Updated", updatedImage: newImage });
    });
  });
};

exports.deleteSingleAd = (req, res) => {
  const { id } = req.params;

  SingleAdPageModel.getImageById(id, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Not found" });

    const image = results[0].image;
    fs.unlink(path.join(__dirname, "../../uploads/singleadpage", image), (err) => {
      if (err) return res.status(500).json({ error: "File delete failed" });

      SingleAdPageModel.deleteImageById(id, (err) => {
        if (err) return res.status(500).json({ error: "DB delete failed" });
        res.json({ message: "Deleted" });
      });
    });
  });
};
