const ProductStatusModel = require("../../models/products/productStatus.model");
// Update product status controller
const updateProductStatus = (req, res) => {
  const { prod_id, productStatus } = req.body;

  console.log("🌐 API Hit: /product-status/update");
  console.log(`📥 Request Body -> prod_id: ${prod_id}, productStatus: ${productStatus}`);

  if (!prod_id || !productStatus) {
    console.warn("⚠️ Missing prod_id or productStatus in request");
    return res.status(400).json({ message: "prod_id and productStatus are required" });
  }

  ProductStatusModel.updateProductStatus(prod_id, productStatus, (err, result) => {
    if (err) {
      console.error("❌ Controller Error updating product status:", err);
      return res.status(500).json({ message: "Failed to update product status" });
    }

    console.log("✅ DB Response ->", result);

    if (result.affectedRows === 0) {
      console.warn(`⚠️ No product found with prod_id: ${prod_id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`🎉 Product status updated successfully for prod_id: ${prod_id}`);
    res.status(200).json({ message: "Product status updated successfully" });
  });
};

module.exports = {
  updateProductStatus,
};
