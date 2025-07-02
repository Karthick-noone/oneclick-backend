const Career = require('../../models/contact/careerModel');

exports.submitApplication = (req, res) => {
  const { name, email, phone, position, startDate } = req.body;
  const resumeLink = req.file ? req.file.filename : "";

  // Validate required fields
  if (!name || !email || !phone || !position || !startDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  Career.submitApplication({ name, email, phone, position, startDate, resumeLink }, (err, result) => {
    if (err) {
      console.error("Error submitting application:", err);
      return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }

    // Check for model-level custom error (e.g., re-apply limit)
    if (result && result.error) {
      return res.status(400).json({ message: result.message });
    }

    // Success
    return res.status(200).json({ message: "Application submitted successfully." });
  });
};


exports.fetchApplications = (req, res) => {
  Career.fetchApplications((err, results) => {
    if (err) {
      console.error("Error fetching applications:", err);
      return res.status(500).send("Server Error");
    }
    res.json(results);
  });
};

exports.deleteApplication = (req, res) => {
  const { id } = req.params;

  Career.deleteApplication(id, (err, result) => {
    if (err) {
      console.error("Error deleting application:", err);
      return res.status(500).json({ message: "Failed to delete application" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Application deleted successfully" });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  });
};
