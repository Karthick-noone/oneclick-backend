// controllers/pricemargins/margins.controller.js

const MarginModel = require("../../models/pricemargins/margins.model");

const MarginController = {
  // GET all margin rules
  getMargins: async (req, res) => {
    try {
      const margins = await MarginModel.getAll();
      res.json(margins);
    } catch (error) {
      console.error("Error fetching margins:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST add new margin
  addMargin: async (req, res) => {
    try {
      const { range_from, range_to, margin_amount } = req.body;

      if (!range_from || !range_to || !margin_amount) {
        return res.status(400).json({ error: "All fields are required" });
      }

      await MarginModel.add({ range_from, range_to, margin_amount });

      res.json({ success: true, message: "Margin added successfully" });
    } catch (error) {
      console.error("Error adding margin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // UPDATE margin
updateMargin: async (req, res) => {
  try {
    const { id } = req.params;
    const { range_from, range_to, margin_amount } = req.body;

    if (!range_from || !range_to || !margin_amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await MarginModel.update(id, {
      range_from,
      range_to,
      margin_amount,
    });

    res.json({ success: true, message: "Margin updated successfully" });
  } catch (error) {
    console.error("Error updating margin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
},


  // DELETE a margin by ID
  deleteMargin: async (req, res) => {
    try {
      const { id } = req.params;

      await MarginModel.delete(id);

      res.json({ success: true, message: "Margin deleted successfully" });
    } catch (error) {
      console.error("Error deleting margin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};



module.exports = MarginController;
