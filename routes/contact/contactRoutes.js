const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact/contactController');

// Route to handle contact submission
router.post('/contact', contactController.addContact);

// Route to fetch contacts
router.get('/fetchcontacts', contactController.fetchContacts);

// Route to delete a contact
router.delete('/api/deletecontact/:id', contactController.deleteContact);

module.exports = router;
