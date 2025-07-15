const accessoriesModel = require("../../models/accessories/accessories.model");

exports.getAccessoriesByCategory = (category) => async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  try {
    const additionalAccessories = await accessoriesModel.getAdditionalAccessories(productId);
    const categoryAccessories = await accessoriesModel.getCategoryAccessories(category);

    return res.status(200).json({
      additionalAccessories,
      categoryAccessories,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addFrequentlyBuyAccessories = async (req, res) => {
  const { id, accessoryIds } = req.body;

  if (!id) return res.status(400).send("Product ID is required.");

  try {
    await accessoriesModel.updateFrequentlyBuyAccessories(id, accessoryIds || null);
    return res.send("Accessories updated successfully.");
  } catch (err) {
    return res.status(500).send("Error updating accessories.");
  }
};

exports.getAccessoryCount = async (req, res) => {
  const { productId } = req.params;

  // console.log(`[API] /api/accessorycount/${productId} called`);

  try {
    const result = await accessoriesModel.getAccessoryCount(productId);
    // console.log(`[SUCCESS] Accessory count for ${productId}: ${result.accessoryCount}`);
    res.json(result);
  } catch (error) {
    // console.error(`[ERROR] Failed to fetch accessory count for ${productId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
