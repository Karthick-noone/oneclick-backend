const Contact = require('../../models/contact/contactModel');

exports.addContact = (req, res) => {
  const { name, email, subject, message, number } = req.body;

  // Validate input
  if (!name || !email || !subject || !message || !number) {
    return res.status(400).send("All fields are required");
  }

  Contact.addContact({ name, email, subject, message, number }, (err, result) => {
    if (err) {
      console.error("Error adding contact:", err);
      return res.status(500).send("Failed to save the message. Please try again.");
    }
    res.status(200).send(result);
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
