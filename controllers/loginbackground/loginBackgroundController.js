const path = require("path");
const fs = require("fs");
const LoginBackgroundModel = require("../../models/loginbackground_model/loginBackgroundModel");

exports.fetchLoginBg = (req, res) => {
  LoginBackgroundModel.fetchLoginBg((err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch images" });
    res.json(results);
  });
};

exports.addLoginBg = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }

  LoginBackgroundModel.insertLoginBg(req.file.filename, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add image" });
    res.json({ message: "Image added successfully", id: result.insertId });
  });
};

exports.updateLoginBg = (req, res) => {
  const { id } = req.params;
  let newImage = req.file ? req.file.filename : null;

  if (!newImage) {
    return res.status(400).json({ error: "Image is required" });
  }

  LoginBackgroundModel.getLoginBgById(id, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Image not found" });

    const oldImage = results[0].image;
    const fields = ["image = ?"];
    const values = [newImage];

    LoginBackgroundModel.updateLoginBg(fields, values, id, (err) => {
      if (err) return res.status(500).json({ error: "Failed to update image" });

      fs.unlink(path.join(__dirname, "../../uploads/loginbackground", oldImage), () => {});
      res.json({ message: "Image updated successfully", updatedImage: newImage });
    });
  });
};

exports.deleteLoginBg = (req, res) => {
  const { id } = req.params;

  LoginBackgroundModel.getLoginBgById(id, (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Image not found" });

    const image = results[0].image;
    fs.unlink(path.join(__dirname, "../../uploads/loginbackground", image), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete image" });

      LoginBackgroundModel.deleteLoginBgById(id, (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete image from database" });
        res.json({ message: "Image deleted successfully" });
      });
    });
  });
};
