const model = require("../../models/reports/reports.model");

exports.getSalesReport = (req, res) => {
  model.getSalesReport((err, results) => {
    if (err) return res.status(500).send("Error fetching sales report");
    res.json(results);
  });
};

exports.getOrdersReport = (req, res) => {
  model.getOrdersReport((err, results) => {
    if (err) return res.status(500).send("Error fetching orders report");
    res.json(results);
  });
};

exports.getCustomersReport = (req, res) => {
  model.getCustomersReport((err, results) => {
    if (err) return res.status(500).send("Error fetching customers report");
    res.json(results);
  });
};

exports.deleteSalesReport = (req, res) => {
  model.deleteSalesReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting sales report" });
    res.status(200).json({ message: "Sales report deleted successfully" });
  });
};

exports.deleteOrderReport = (req, res) => {
  model.deleteOrderReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting order report" });
    res.status(200).json({ message: "Order report deleted successfully" });
  });
};

exports.deleteCustomerReport = (req, res) => {
  model.deleteCustomerReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting customer report" });
    res.status(200).json({ message: "Customer report deleted successfully" });
  });
};

exports.getUsers = (req, res) => {
  model.getUsers((err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  model.deleteUser(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete career entry" });
    if (result.affectedRows > 0)
      res.status(200).json({ message: "Career entry deleted successfully" });
    else
      res.status(404).json({ message: "Career entry not found" });
  });
};


exports.getPendingPayments = (req, res) => {
  model.getPendingPayments((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results); // Send the fetched pending payments data as response
  });
};



// Fetch Product Categories for Pie Chart
exports.getProductCategories = (req, res) => {
  model.getProductCategories((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching product categories" });
    }
    res.status(200).json(results); // Return product categories data
  });
};

// Fetch Product Categories and Total Amount
exports.getProductCategoryAmounts = (req, res) => {
  model.getProductCategoryAmounts((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching product category amounts" });
    }
    res.status(200).json(results); // Return product category total amount data
  });
};