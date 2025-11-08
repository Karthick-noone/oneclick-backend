// routes/notifications/notification.route.js
const express = require('express');
const NotificationController = require('../../controllers/notifications/notification.controller');

const router = express.Router();

// GET    /notifications
router.get('/', NotificationController.getAll);

// PATCH  /notifications/:id/read
router.patch('/:id/read', NotificationController.markAsRead);

// PATCH  /notifications/mark-all-read
router.patch('/mark-all-read', NotificationController.markAllAsRead);

// DELETE /notifications/delete-old   (supports ?days=15 override)
router.delete('/delete-old', NotificationController.deleteOld);

// (Optional) POST /notifications
router.post('/', NotificationController.create);

module.exports = router;
