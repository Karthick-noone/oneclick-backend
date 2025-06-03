// staffController.js

const staffModel = require('../../models/staffs/staffs.model'); // Adjust path if necessary

// Get all staff
exports.getAllStaff = (req, res) => {
  staffModel.getAllStaff((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching staff data" });
    }
    res.status(200).json(results); // Return staff data
  });
};

// Add a new staff
exports.addStaff = (req, res) => {
  const { staffname, username, password, status } = req.body;

  staffModel.addStaff(staffname, username, password, status, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error adding staff" });
    }
    res.status(201).json(result); // Return added staff info
  });
};

// Update staff
exports.updateStaff = (req, res) => {
  const { staffname, username, password, status } = req.body;
  const staffId = req.params.id;

  staffModel.updateStaff(staffId, staffname, username, password, status, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error updating staff" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff: { id: staffId, staffname, username, password, status },
    });
  });
};

// Delete staff
exports.deleteStaff = (req, res) => {
  const staffId = req.params.id;

  staffModel.deleteStaff(staffId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error deleting staff" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  });
};
