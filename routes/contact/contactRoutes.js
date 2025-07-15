const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact/contactController');

// Route to handle contact submission
router.post('/contact', contactController.addContact);

// Route to fetch contacts
router.get('/fetchcontacts', contactController.fetchContacts);

// Route to delete a contact
router.delete('/api/deletecontact/:id', contactController.deleteContact);


router.get('/api/enquiries/:userNumber', contactController.getPreviousEnquiries);


// GET all enquiries
router.get("/api/enquiries", contactController.getAllEnquiries);

// PATCH mark as read
router.patch("/api/enquiries/mark-read/:id", contactController.markAsRead);

module.exports = router;
