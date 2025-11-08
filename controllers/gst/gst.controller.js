// controllers/gst/gst.controller.js
const GSTModel = require("../../models/gst/gst.model");

exports.fetchGSTDetails = async (req, res) => {
  const gstin = req.query.gstin;
  console.log("🟢 [Controller] Received request to fetch GST details for:", gstin);

  if (!gstin || gstin.length !== 15) {
    console.warn("⚠️ [Controller] Invalid GSTIN format:", gstin);
    return res.status(400).json({ message: "Invalid GSTIN format" });
  }

  console.log("📡 [Controller] Calling Model to fetch GST details...");

  GSTModel.fetchGSTDetails(gstin, (err, result) => {
    if (err) {
      console.error("❌ [Controller] Error while fetching GST details from Model:", err);
      return res.status(500).json({ message: "Failed to fetch GST details" });
    }

    if (!result.success) {
      console.warn("⚠️ [Controller] GST details not found or invalid GSTIN:", gstin);
      return res.status(404).json({ message: result.message });
    }

    console.log("✅ [Controller] GST details fetched successfully for:", gstin);
    res.json(result.details);
  });
};
