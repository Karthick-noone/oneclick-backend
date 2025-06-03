const RecentlyViewedModel = require("../../models/products/recentlyViewedProductsModel");

exports.getRecentlyViewedProduct = (req, res) => {
  const id = req.params.id;
  console.log("Requested Product ID:", id);

  RecentlyViewedModel.getProductById(id, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results);
  });
};
