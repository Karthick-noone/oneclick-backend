const Contact = require('../../models/contact/contactModel');

exports.addContact = (req, res) => {
  const { name, email, subject, message, number } = req.body;

  if (!name || !email || !subject || !message || !number) {
    return res.status(400).send("All fields are required");
  }

  Contact.addContact({ name, email, subject, message, number }, (err, result) => {
    if (err) {
      console.error("Error adding contact:", err);
      return res.status(500).send("Failed to save the message. Please try again.");
    }

    if (result.status === "limit_reached") {
      return res.status(429).send(result.message); // Too many requests
    }

    res.status(200).send(result.message);
  });
};

exports.fetchContacts = (req, res) => {
  Contact.fetchContacts((err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

exports.deleteContact = (req, res) => {
  const { id } = req.params;

  Contact.deleteContact(id, (err, result) => {
    if (err) {
      console.error("Error deleting contact entry:", err);
      return res.status(500).json({ message: "Failed to delete contact entry" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Contact entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact entry not found" });
    }
  });
};


// Get previous enquiries by user number
exports.getPreviousEnquiries = (req, res) => {
  const { userNumber } = req.params;

  if (!userNumber) {
    return res.status(400).json({ message: "User number is required." });
  }

  Contact.getPreviousEnquiries(userNumber, (err, data) => {
    if (err) {
      console.error("[GetPreviousEnquiries] Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    return res.status(200).json({ enquiries: data });
  });
};



// Get all enquiries
exports.getAllEnquiries = (req, res) => {
  Contact.getAllEnquiries((err, data) => {
    if (err) {
      console.error("[GetEnquiries] Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json({ enquiries: data });
  });
};

// Mark enquiry as read
exports.markAsRead = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Enquiry ID is required" });
  }

  Contact.markEnquiryAsRead(id, (err, result) => {
    if (err) {
      console.error("[MarkAsRead] Error:", err);
      return res.status(500).json({ message: "Failed to mark enquiry as read" });
    }
    res.status(200).json({ message: "Enquiry marked as read" });
  });
};