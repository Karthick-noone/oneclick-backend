// models/gst/gst.model.js
const fetch = require("node-fetch");

const GSTModel = {
  fetchGSTDetails: async (gstin, callback) => {
    console.log("📡 [Model] Fetching GST details for:", gstin);
    const url = `http://sheet.gstincheck.co.in/check/adf83afe7d456ba5524b2cf758cfa4ef/${gstin}`;

    try {
      const response = await fetch(url);
      console.log("🌐 [Model] API Response Status:", response.status);

      if (!response.ok) {
        console.error("❌ [Model] API request failed with status:", response.status);
        return callback(null, {
          success: false,
          message: `API Error: Received status ${response.status}`,
        });
      }

      const data = await response.json();
      console.log("📦 [Model] Raw API Response:", data);

      // Check if GSTIN is invalid or inactive
      if (!data.flag || !data.data) {
        console.warn("⚠️ [Model] Invalid or inactive GSTIN:", gstin);
        return callback(null, {
          success: false,
          message: "Invalid or inactive GSTIN",
        });
      }

      const gstData = data.data;
      const result = {
        success: true,
        details: {
          gstin: gstData.gstin,
          trade_name: gstData.tradeNam || "",
          legal_name: gstData.lgnm || "",
          address: gstData.pradr?.adr || gstData.adadr || "",
          city: gstData.pradr?.addr?.dst || "",
          state: gstData.stj || "",
          pincode: gstData.pradr?.addr?.pncd || "",
        },
      };

      console.log("✅ [Model] GST details fetched successfully for:", gstin);
      callback(null, result);
    } catch (error) {
      console.error("🔥 [Model] Exception while calling GST API:", error.message);

      // Distinguish between network errors and other issues
      const errorMessage =
        error.type === "system"
          ? "Network or API connection error"
          : "Unexpected error while fetching GST details";

      callback(null, { success: false, message: errorMessage });
    }
  },
};

module.exports = GSTModel;
